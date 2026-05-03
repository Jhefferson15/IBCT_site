// src/domain/use_cases/get_lessons_use_case.js

export class GetLessonsUseCase {
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    async execute(departmentId) {
        try {
            return await this.lessonRepository.getLessonsByDepartment(departmentId);
        } catch (error) {
            console.error(`Erro ao buscar lições para o departamento ${departmentId}:`, error);
            return [];
        }
    }
}



