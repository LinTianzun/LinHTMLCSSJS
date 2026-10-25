document.addEventListener("DOMContentLoaded", function () {
    const pageSize = 3; // 每页显示的条目数量
    const tbody = document.querySelector('tbody');
    const trList = tbody.querySelectorAll('tr');
    const totalPages = Math.ceil(trList.length / pageSize);

    function showPage(page) {
        for (let i = 0; i < trList.length; i++) {
            if (i >= (page - 1) * pageSize && i < page * pageSize) {
                trList[i].style.display = '';
            } else {
                trList[i].style.display = 'none';
            }
        }
    }

    function createPaginationButtons() {
        const pagination = document.querySelector('.pagination');
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-number');
            li.textContent = i;
            li.addEventListener('click', function () {
                showPage(i);
                document.querySelector('.page-number.active').classList.remove('active');
                this.classList.add('active');
            });
            pagination.insertBefore(li, pagination.children[pagination.children.length - 1]);
        }
        showPage(1);
        pagination.querySelector('.page-number').classList.add('active');
    }

    createPaginationButtons();

    const prevBtn = document.querySelector('.page-btn-prev');
    const nextBtn = document.querySelector('.page-btn-next');
    let currentPage = 1;

    prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            showPage(--currentPage);
            document.querySelector('.page-number.active').classList.remove('active');
            document.querySelectorAll('.page-number')[currentPage - 1].classList.add('active');
        }
    });

    nextBtn.addEventListener('click', function () {
        if (currentPage < totalPages) {
            showPage(++currentPage);
            document.querySelector('.page-number.active').classList.remove('active');
            document.querySelectorAll('.page-number')[currentPage - 1].classList.add('active');
        }
    });
});