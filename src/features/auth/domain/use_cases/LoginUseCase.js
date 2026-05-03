export class LoginUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute(email, password) {
        // Validações de regra de negócio podem vir aqui
        if (!email || !password) {
            return { success: false, message: "E-mail e senha são obrigatórios." };
        }
        return await this.authRepository.login(email, password);
    }
}



