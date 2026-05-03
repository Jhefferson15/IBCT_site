export class GetProductsUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(departmentId) {
        if (!departmentId) {
            throw new Error("O departmentId é obrigatório para buscar produtos.");
        }
        return await this.productRepository.getProductsByDepartment(departmentId);
    }
}



