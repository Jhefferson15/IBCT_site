export class CheckAdminRoleUseCase {
    constructor(authRepository, adminRepository) {
        this.authRepository = authRepository;
        this.adminRepository = adminRepository;
    }

    async execute(userId) {
        if (!userId) return false;
        
        // No Firestore, verificamos na coleção de usuários se ele tem o papel de admin
        // Nota: Em um ambiente de produção, isso deve ser feito via Custom Claims no Firebase Auth,
        // mas aqui seguiremos a estrutura de coleção para simplicidade.
        const users = await this.adminRepository.getAllFromCollection('users');
        const user = users.find(u => u.id === userId);
        
        return user && user.role === 'admin';
    }
}



