export class GetMemberDataUseCase {
    constructor(memberRepository) {
        this.memberRepository = memberRepository;
    }

    async execute(userId) {
        const [profile, notices] = await Promise.all([
            this.memberRepository.getProfile(userId),
            this.memberRepository.getNotices()
        ]);

        return { profile, notices };
    }
}



