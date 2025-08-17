// Minimal interactive blog features
document.addEventListener('DOMContentLoaded', function() {
    
    // Add typing animation to the site title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Apply typing effect to site title on page load
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
        const originalText = siteTitle.textContent;
        typeWriter(siteTitle, originalText, 80);
    }
    
    // Add reading progress indicator for article pages
    function addReadingProgress() {
        if (document.querySelector('article')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'reading-progress';
            progressBar.innerHTML = '<div class="progress-fill"></div>';
            document.body.appendChild(progressBar);
            
            window.addEventListener('scroll', function() {
                const article = document.querySelector('article');
                if (!article) return;
                
                const rect = article.getBoundingClientRect();
                const articleHeight = article.offsetHeight;
                const windowHeight = window.innerHeight;
                const scrolled = Math.max(0, -rect.top);
                const progress = Math.min(100, (scrolled / (articleHeight - windowHeight)) * 100);
                
                document.querySelector('.progress-fill').style.width = progress + '%';
            });
        }
    }
    
    // Simple tag filtering without animations
    function addTagFiltering() {
        const searchInput = document.getElementById('tag-search');
        const posts = document.querySelectorAll('.post-item');
        
        if (searchInput && posts.length > 0) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                posts.forEach(function(post) {
                    const tags = post.getAttribute('data-tags');
                    if (!tags) return;
                    
                    const shouldShow = searchTerm === '' || tags.toLowerCase().includes(searchTerm);
                    post.style.display = shouldShow ? 'block' : 'none';
                });
            });
        }
    }
    
    // Add anchor links to headings
    function addHeaderAnchors() {
        const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
        
        headings.forEach(function(heading) {
            const link = document.createElement('a');
            link.className = 'header-anchor';
            link.href = '#' + heading.id;
            link.innerHTML = '#';
            link.title = 'Link to this heading';
            
            heading.insertBefore(link, heading.firstChild);
        });
    }
    
    // Add copy buttons to code blocks
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach(function(pre) {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'copy';
            button.title = 'Copy code to clipboard';
            
            button.addEventListener('click', function() {
                const code = pre.querySelector('code');
                const text = code ? code.textContent : pre.textContent;
                
                navigator.clipboard.writeText(text).then(function() {
                    button.textContent = 'copied!';
                    button.classList.add('copied');
                    
                    setTimeout(function() {
                        button.textContent = 'copy';
                        button.classList.remove('copied');
                    }, 2000);
                }).catch(function() {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    button.textContent = 'copied!';
                    button.classList.add('copied');
                    
                    setTimeout(function() {
                        button.textContent = 'copy';
                        button.classList.remove('copied');
                    }, 2000);
                });
            });
            
            pre.appendChild(button);
        });
    }
    
    // Initialize features
    addReadingProgress();
    addTagFiltering();
    addHeaderAnchors();
    addCopyButtons();
});
