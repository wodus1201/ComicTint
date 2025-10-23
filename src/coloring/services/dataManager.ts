import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColoringProject, ColoringProjectIndex } from '../models/coloring';

interface DataManagerConfig {
  projectStorageKey: string;
  indexStorageKey: string;
  maxProjects: number;
  compressionEnabled: boolean;
}

interface SaveProjectResult {
  success: boolean;
  projectId?: string;
  error?: string;
}

interface LoadProjectResult {
  success: boolean;
  project?: ColoringProject;
  error?: string;
}

interface ProjectIndexResult {
  success: boolean;
  projects?: ColoringProjectIndex[];
  error?: string;
}

class DataManager {
  private config: DataManagerConfig;

  constructor(config?: Partial<DataManagerConfig>) {
    this.config = {
      projectStorageKey: 'coloring_projects',
      indexStorageKey: 'coloring_project_index',
      maxProjects: 100,
      compressionEnabled: true,
      ...config,
    };
  }

  async saveProject(project: ColoringProject): Promise<SaveProjectResult> {
    try {
      const projectData = this.config.compressionEnabled
        ? await this.compressProject(project)
        : JSON.stringify(project);

      const projectKey = `${this.config.projectStorageKey}_${project.id}`;
      await AsyncStorage.setItem(projectKey, projectData);

      await this.updateProjectIndex(project);

      return {
        success: true,
        projectId: project.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '프로젝트 저장 실패',
      };
    }
  }

  async loadProject(projectId: string): Promise<LoadProjectResult> {
    try {
      const projectKey = `${this.config.projectStorageKey}_${projectId}`;
      const projectData = await AsyncStorage.getItem(projectKey);

      if (!projectData) {
        return {
          success: false,
          error: '프로젝트를 찾을 수 없습니다.',
        };
      }

      const project = this.config.compressionEnabled
        ? await this.decompressProject(projectData)
        : (JSON.parse(projectData) as ColoringProject);

      return {
        success: true,
        project,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '프로젝트 로드 실패',
      };
    }
  }

  async deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const projectKey = `${this.config.projectStorageKey}_${projectId}`;
      await AsyncStorage.removeItem(projectKey);

      await this.removeFromProjectIndex(projectId);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '프로젝트 삭제 실패',
      };
    }
  }

  async getProjectIndex(): Promise<ProjectIndexResult> {
    try {
      const indexData = await AsyncStorage.getItem(this.config.indexStorageKey);

      if (!indexData) {
        return {
          success: true,
          projects: [],
        };
      }

      const projects = JSON.parse(indexData) as ColoringProjectIndex[];
      return {
        success: true,
        projects,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '프로젝트 인덱스 로드 실패',
      };
    }
  }

  private async updateProjectIndex(project: ColoringProject): Promise<void> {
    try {
      const indexResult = await this.getProjectIndex();
      let projects = indexResult.projects || [];

      const existingIndex = projects.findIndex(p => p.id === project.id);
      const projectIndex: ColoringProjectIndex = {
        id: project.id,
        pdfId: project.pdfId,
        pageNumber: project.pageNumber,
        title: project.metadata.title,
        thumbnail: project.metadata.thumbnail,
        createdAt: project.createdAt,
        lastModified: project.lastModified,
      };

      if (existingIndex >= 0) {
        projects[existingIndex] = projectIndex;
      } else {
        projects.unshift(projectIndex);
      }

      if (projects.length > this.config.maxProjects) {
        projects = projects
          .sort((a, b) => b.lastModified - a.lastModified)
          .slice(0, this.config.maxProjects);
      }

      await AsyncStorage.setItem(this.config.indexStorageKey, JSON.stringify(projects));
    } catch (error) {
      console.error('프로젝트 인덱스 업데이트 실패:', error);
    }
  }

  private async removeFromProjectIndex(projectId: string): Promise<void> {
    try {
      const indexResult = await this.getProjectIndex();
      if (!indexResult.success || !indexResult.projects) return;

      const projects = indexResult.projects.filter(p => p.id !== projectId);
      await AsyncStorage.setItem(this.config.indexStorageKey, JSON.stringify(projects));
    } catch (error) {
      console.error('프로젝트 인덱스에서 제거 실패:', error);
    }
  }

  private async compressProject(project: ColoringProject): Promise<string> {
    // TODO: 실제 압축 로직 구현 (예: LZ4, GZIP 등)
    // 현재는 JSON 문자열 반환
    return JSON.stringify(project);
  }

  private async decompressProject(compressedData: string): Promise<ColoringProject> {
    // TODO: 실제 압축 해제 로직 구현
    // 현재는 JSON 파싱만 수행
    return JSON.parse(compressedData) as ColoringProject;
  }

  async searchProjects(query: string): Promise<ProjectIndexResult> {
    try {
      const indexResult = await this.getProjectIndex();
      if (!indexResult.success || !indexResult.projects) {
        return indexResult;
      }

      const filteredProjects = indexResult.projects.filter(
        project =>
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.pdfId.toLowerCase().includes(query.toLowerCase()),
      );

      return {
        success: true,
        projects: filteredProjects,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '프로젝트 검색 실패',
      };
    }
  }

  async getProjectStats(): Promise<{
    totalProjects: number;
    totalSize: number;
    oldestProject?: ColoringProjectIndex;
    newestProject?: ColoringProjectIndex;
  }> {
    try {
      const indexResult = await this.getProjectIndex();
      if (!indexResult.success || !indexResult.projects) {
        return { totalProjects: 0, totalSize: 0 };
      }

      const projects = indexResult.projects;
      const totalProjects = projects.length;

      // TODO: 실제 크기 계산 구현
      const totalSize = 0;

      const sortedProjects = projects.sort((a, b) => a.createdAt - b.createdAt);
      const oldestProject = sortedProjects[0];
      const newestProject = sortedProjects[sortedProjects.length - 1];

      return {
        totalProjects,
        totalSize,
        oldestProject,
        newestProject,
      };
    } catch (error) {
      return { totalProjects: 0, totalSize: 0 };
    }
  }

  async cleanupStorage(): Promise<{ success: boolean; error?: string }> {
    try {
      const indexResult = await this.getProjectIndex();
      if (!indexResult.success || !indexResult.projects) {
        return { success: true };
      }

      const projects = indexResult.projects;
      const validProjectIds = new Set(projects.map(p => p.id));

      const allKeys = await AsyncStorage.getAllKeys();
      const projectKeys = allKeys.filter(
        key => key.startsWith(this.config.projectStorageKey) && !key.includes('_index'),
      );

      for (const key of projectKeys) {
        const projectId = key.replace(`${this.config.projectStorageKey}_`, '');
        if (!validProjectIds.has(projectId)) {
          await AsyncStorage.removeItem(key);
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '스토리지 정리 실패',
      };
    }
  }

  updateConfig(newConfig: Partial<DataManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): DataManagerConfig {
    return { ...this.config };
  }
}

export const dataManager = new DataManager();

export default DataManager;
