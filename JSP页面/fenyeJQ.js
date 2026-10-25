$(document).ready(function () {
    const pageSize = 3; // 每页显示的条目数量
    const tbody = $('tbody');
    const trList = tbody.find('tr');
    const totalPages = Math.ceil(trList.length / pageSize);

    $('.resultye').text(totalPages)
    $('.resultxiang').text(trList.length)

    function showPage(page) {
        trList.hide().slice((page - 1) * pageSize, page * pageSize).show();
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
                currentPage = i;
            });
            pagination.insertBefore(li, pagination.children[pagination.children.length - 1]);
        }
        showPage(1);
        pagination.querySelector('.page-number').classList.add('active');
    }

    createPaginationButtons();

    const prevBtn = $('.page-btn-prev');
    const nextBtn = $('.page-btn-next');
    let currentPage = 1;

    prevBtn.on('click', function () {
        if (currentPage > 1) {
            showPage(--currentPage);
            $('.page-number.active').removeClass('active');
            $('.page-number').eq(currentPage - 1).addClass('active');
            $('.current-page').text(currentPage);
        }
        if (currentPage == 1) {
            $('.page-btn-prev').removeClass('isClick');
        }
        if (currentPage < totalPages) {
            $('.page-btn-next').addClass('isClick');
        }
    });

    nextBtn.on('click', function () {
        if (currentPage < totalPages) {
            showPage(++currentPage);
            $('.page-number.active').removeClass('active');
            $('.page-number').eq(currentPage - 1).addClass('active');
            $('.current-page').text(currentPage);
        }
        if (currentPage > 1) {
            $('.page-btn-prev').addClass('isClick');
        }
        if (currentPage >= totalPages) {
            $('.page-btn-next').removeClass('isClick');
        }
    });
});
