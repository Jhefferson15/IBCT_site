export class LoginWithGoogleUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute(credentialToken) {
        if (!credentialToken) {
            return { success: false, message: "Token do Google é obrigatório." };
        }
        return await this.authRepository.loginWithGoogleCredential(credentialToken);
    }
}



