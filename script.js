class GameBrowser {
    constructor() {
        document.querySelector('.game-carousel')?.remove();
        
        this.gameList = document.createElement('div');
        this.gameList.className = 'game-carousel';
        
        this.gameList.innerHTML = `
            <button class="nav-arrow prev"></button>
            <button class="nav-arrow next"></button>
            <div class="carousel-container"></div>
            <div class="carousel-dots"></div>
        `;

        this.carouselContainer = this.gameList.querySelector('.carousel-container');
        this.dotsContainer = this.gameList.querySelector('.carousel-dots');
        this.currentIndex = 0;
        this.isTransitioning = false;

        document.querySelector('main').appendChild(this.gameList);
        
        this.setupNavigation();
        this.initializeGames();
    }

    setupNavigation() {
        const prevButton = this.gameList.querySelector('.prev');
        const nextButton = this.gameList.querySelector('.next');
        
        prevButton.addEventListener('click', () => this.navigate(-1));
        nextButton.addEventListener('click', () => this.navigate(1));
    }

    navigate(direction) {
        const slides = this.carouselContainer.children;
        if (slides.length < 2) return;
        
        const currentSlide = slides[this.currentIndex];
        this.currentIndex = (this.currentIndex + direction + slides.length) % slides.length;
        const nextSlide = slides[this.currentIndex];
        
        currentSlide.style.display = 'none';
        
        nextSlide.style.display = 'block';
        
        this.updateDots();
    }

    updateDots() {
        const dots = this.dotsContainer.children;
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('active', i === this.currentIndex);
        }
    }

    initializeGames() {
        const games = [
            {
                folder: 'sva',
                title: 'SANTA VS THE AIRFORCE',
                description: 'It all started with a simple question, who would win?',
                thumbnail: 'https://i.imgur.com/DyQLrfJ.gif'
            },
            {
                folder: 'noseas',
                title: 'NO SEAS',
                description: 'A game inspired by the Google dino, taken to new levels.',
                thumbnail: 'https://i.imgur.com/K5aoSLw.gif'
            },
            {
                folder: 'blahaj',
                title: 'BLAHAJ RUNNER',
                description: 'Featuring Ikea\'s Blahaj, this game is a runner with a twist.',
                thumbnail: 'https://i.imgur.com/fwOkgCq.png'
            }
        ];

        this.renderGameCarousel(games);
    }

    renderGameCarousel(games) {
        games.forEach((game, index) => {
            const slide = document.createElement('div');
            slide.className = 'game-slide';
            slide.dataset.game = game.folder;
            
            if (index !== 0) {
                slide.style.display = 'none';
            }
            
            slide.innerHTML = `
                <div class="game-thumbnail" style="background-image: url('${game.thumbnail}')"></div>
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <button class="play-button">Play Now</button>
                </div>
            `;
            
            this.carouselContainer.appendChild(slide);
            
            const dot = document.createElement('div');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                if (this.currentIndex === index) return;
                const direction = index > this.currentIndex ? 1 : -1;
                this.currentIndex = index - direction;
                this.navigate(direction);
            });
            this.dotsContainer.appendChild(dot);
        });

        this.carouselContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('play-button')) {
                const gameCard = e.target.closest('.game-slide');
                if (gameCard) {
                    this.startGame(gameCard);
                }
            }
        });
    }

    startGame(gameCard) {
        const gameFolder = gameCard.dataset.game;
        this.loadGame(gameFolder);
    }

    loadGame(gameFolder) {
        console.log('Loading game:', gameFolder);
        
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.src = `games/${gameFolder}/index.html`;
        this.currentIframe = iframe;
        
        this.gameList.innerHTML = '';
        
        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        
        if (gameFolder === 'blahaj') {
            console.log('Adding Blahaj class');
            gameContainer.classList.add('blahaj-container');
        }
        
        // Create wrapper for fullscreen
        const fullscreenWrapper = document.createElement('div');
        fullscreenWrapper.className = 'fullscreen-wrapper';
        
        // Create controls container
        const controls = document.createElement('div');
        controls.className = 'game-controls';
        
        // Add fullscreen button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'control-button fullscreen-btn';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                fullscreenWrapper.requestFullscreen();
                document.addEventListener('keydown', this.preventSpaceScroll);
            } else {
                document.exitFullscreen();
                document.removeEventListener('keydown', this.preventSpaceScroll);
            }
        });
        
        // Add library button
        const libraryBtn = document.createElement('button');
        libraryBtn.className = 'control-button library-btn';
        libraryBtn.innerHTML = '≣';
        
        const showLibrary = () => {
            // Create overlay to pause the game
            const pauseOverlay = document.createElement('div');
            pauseOverlay.className = 'pause-overlay';
            fullscreenWrapper.appendChild(pauseOverlay);
            
            // Show library
            const libraryOverlay = document.createElement('div');
            libraryOverlay.className = 'library-overlay';
            
            const miniCarousel = document.createElement('div');
            miniCarousel.className = 'mini-carousel';
            
            // Add active state to library button
            libraryBtn.classList.add('active');
            
            const games = [
                {
                    folder: 'sva',
                    title: 'Santa vs The Airforce',
                    thumbnail: 'https://i.imgur.com/DyQLrfJ.gif'
                },
                {
                    folder: 'noseas',
                    title: 'No Seas',
                    thumbnail: 'https://i.imgur.com/K5aoSLw.gif'
                },
                {
                    folder: 'blahaj',
                    title: 'Blahaj Adventure',
                    thumbnail: 'https://i.imgur.com/fwOkgCq.png'
                }
            ];
            
            games.forEach(game => {
                const gameThumb = document.createElement('div');
                gameThumb.className = 'mini-game-thumb';
                gameThumb.style.backgroundImage = `url('${game.thumbnail}')`;
                gameThumb.addEventListener('click', () => {
                    this.loadGame(game.folder);
                    libraryOverlay.remove();
                    pauseOverlay.remove();
                    libraryBtn.classList.remove('active');
                });
                
                const gameTitle = document.createElement('div');
                gameTitle.className = 'mini-game-title';
                gameTitle.textContent = game.title;
                
                gameThumb.appendChild(gameTitle);
                miniCarousel.appendChild(gameThumb);
            });
            
            libraryOverlay.appendChild(miniCarousel);
            fullscreenWrapper.appendChild(libraryOverlay);
            
            // Close library when library button is clicked again
            const closeLibrary = () => {
                libraryOverlay.remove();
                pauseOverlay.remove();
                libraryBtn.classList.remove('active');
                libraryBtn.removeEventListener('click', closeLibrary);
                libraryBtn.addEventListener('click', showLibrary);
            };
            
            libraryBtn.removeEventListener('click', showLibrary);
            libraryBtn.addEventListener('click', closeLibrary);
        };
        
        libraryBtn.addEventListener('click', showLibrary);
        
        controls.appendChild(fullscreenBtn);
        controls.appendChild(libraryBtn);
        
        // Append everything to the fullscreen wrapper
        fullscreenWrapper.appendChild(iframe);
        fullscreenWrapper.appendChild(controls);
        gameContainer.appendChild(fullscreenWrapper);
        this.gameList.appendChild(gameContainer);

        // Handle fullscreen change
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                document.removeEventListener('keydown', this.preventSpaceScroll);
            }
        });
    }

    exitGame() {
        window.gameBrowser = new GameBrowser();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gameBrowser = new GameBrowser();
});

document.getElementById('homeButton').addEventListener('click', (e) => {
    e.preventDefault();
    window.gameBrowser = new GameBrowser();
});