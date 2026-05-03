// src/domain/use_cases/get_department_notices_use_case.js

export class GetDepartmentNoticesUseCase {
    constructor(noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    async execute(departmentId) {
        try {
            return await this.noticeRepository.getNoticesByDepartment(departmentId);
        } catch (error) {
            console.error(`Erro ao buscar avisos para o departamento ${departmentId}:`, error);
            return [];
        }
    }
}



