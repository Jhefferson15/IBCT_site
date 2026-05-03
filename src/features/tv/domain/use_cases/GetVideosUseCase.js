export class GetVideosUseCase {
    constructor(videoRepository) {
        this.videoRepository = videoRepository;
    }

    async execute(filter = 'all', searchQuery = '') {
        let videos = await this.videoRepository.getAllVideos();

        if (filter !== 'all') {
            videos = videos.filter(v => v.category === filter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            videos = videos.filter(v => 
                v.title.toLowerCase().includes(query) || 
                v.description?.toLowerCase().includes(query)
            );
        }

        return videos;
    }
}



