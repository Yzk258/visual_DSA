document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-menu li[data-page]');
    const mainFrame = document.getElementById('main-frame');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // 排除首页点击自己导致死循环的情况
            if (targetPage === "./pages/index.html") {
                window.location.reload(); 
                return;
            }

            if (targetPage && mainFrame) {
                // 切换 active 类
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // 切换内容
                mainFrame.src = targetPage;
            }
        });
    });
});