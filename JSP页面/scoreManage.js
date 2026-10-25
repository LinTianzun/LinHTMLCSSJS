$(document).ready(function () {
    let bjArr = null //存放班级信息的数组
    let scoreArr = null //存放学生成绩信息的数组
    let searchScoreArr = []  //存放搜索的学生成绩信息的数组

    //班级模糊搜索
    $('#searchStuScore').click(function (){
        let isSear = false  //设置是否查询到了
        searchScoreArr = []  //每次点击查询的时候 先清空 搜索的数组
        const searchInfo = $('#searchScoreInfo').val()
        if(searchInfo === ''){
            console.log('搜索值为空 返回所有的数据')
            renderDataToTable(scoreArr)
            fenye(scoreArr)
        }else {
            console.log(searchInfo)
            console.log(scoreArr)
            //遍历传递过来的班级数组
            scoreArr.forEach((value)=>{  //将查询到的信息添加到搜索数组
                if(value.xh.indexOf(searchInfo) !== -1 || value.xm.indexOf(searchInfo) !== -1){
                    searchScoreArr.push(value)
                    isSear = true
                }
            })
            if(isSear){ //如果查询到了结果
                console.log(searchScoreArr)  //取到所有相似值的搜索数组
                renderDataToTable(searchScoreArr)  //重新渲染数据
                fenye(searchScoreArr)  //修改分页按钮
            }else {
                alert("未查询到"+searchInfo)
                $('#searchClassInfo').val('')  //清空搜索框
                renderDataToTable(scoreArr)  //渲染所有的数据
                fenye(scoreArr)  //更新分页按钮
            }

        }

//更新下拉框里的数据
        stuClassWrite(bjArr)
    })


    //获取班级信息
    getBjbhAndBjmc()
    // 获取成绩信息数据
    stuScoreWrite()

    // 添加按钮功能
    $('#addClassBtn').click(function () {
        $('.home-section .homeCT').empty()  //清空内容
        $('.home-section .homeCT').removeClass().addClass('addstuScoreContent homeCT');
        $.ajax({
            url: 'addScore.jsp',
            success: function (response) {
                $('.home-section .addstuScoreContent').html(response)
            }
        })
    })

    //获取到班级班号以及班级名称
    function getBjbhAndBjmc() {
    $.ajax({
        url: 'StuClassManage',
        method: 'POST',
        dataType: 'json',
        success: function (data) {
            console.log("传递之后的:", data)
            bjArr = data
        },
        error: function (xhr, status, error) {
            // 处理错误情况
            console.log("Error occurred while fetching data: " + error);
        }

    })
    }


    //渲染更新成绩数据
    function stuScoreWrite() {
        $.ajax({
            url: 'StuScoreManage',
            method: 'POST',
            dataType: 'json',
            success: function (data) {
                console.log("传递之后的:", data)
                scoreArr = data
                console.log("存入scoreArr数组", scoreArr)
                //获取班级信息
                // getBjbhAndBjmc()
                // 在成功获取数据后，调用函数更新表格内容
                renderDataToTable(scoreArr)
                //更新下拉框里的数据
                stuClassWrite(bjArr)
                //  数据更新之后执行分页功能
                fenye(scoreArr);
            },
            error: function (xhr, status, error) {
                // 处理错误情况
                console.log("Error occurred while fetching data: " + error);
            }
        })
    }




    // 更新表格内容的函数
    function renderDataToTable(data) {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // 清空<tbody>中的内容

        data.forEach((item, index) => {
            const indexID = index + 1;
            const tr = document.createElement('tr');
            //根据bh查询到班级名称
            let bjmc = bjArr.find(classItem => classItem.bjbh === item.bh)?.bjmc || '为止班级'

            tr.innerHTML = `
            <tr>
                <td>
                    <div class="select-menu">
                        <div class="selectStuScoreNa">
                            <span id="finalStubjbh${indexID}" style="display: none;">${item.bh}</span>
                            <span id="finalStubjmc${indexID}">${bjmc}</span>
                            <a class="iconDo">
                                <ion-icon name="chevron-down-outline"></ion-icon>
                            </a>
                        </div>
                        <div class="options-list">

                        </div>
                    </div>
                </td>
                <td>
                    <input type="text" id="xh${indexID}" value="${item.xh}" >
                </td>
                <td>
                    <input type="text" id="xm${indexID}" value="${item.xm}">
                </td>
                <td>
                    <input type="text" id="yw${indexID}" value="${item.yw}">
                </td>
                <td>
                    <input type="text" id="sx${indexID}" value="${item.sx}">
                </td>
                <td>
                    <input type="text" id="yy${indexID}" value="${item.yy}">
                </td>
                <td>
                    <input type="text" id="zf${indexID}" value="${item.zf}">
                </td>
                <td>
                    <input type="button" value="修改" class="liBtn reBtn${indexID}" id="reviseClassBtn">
                    <input type="button" value="删除" class="liBtn deBtn${indexID}" id="deleteClassBtn">
                </td>
            </tr>
            `;
            tbody.appendChild(tr); // 将新行添加到<tbody>中

            // 添加修改和删除按钮的点击事件监听
            $(`.reBtn${indexID}`).click(function () {
                console.log("我是修改按钮")
            });

            $(`.deBtn${indexID}`).click(function () {
                console.log("我是删除按钮")
            });


        });


    }

    let isone = true
    //渲染班级信息的事件
    function stuClassWrite(data) {
        const selectStuScoreNaList = document.querySelectorAll('.selectStuScoreNa');

        // 移除之前绑定的所有事件处理程序
        // const selectStuScoreNaList = document.querySelectorAll('.selectStuScoreNa');
        selectStuScoreNaList.forEach((selectStuScoreNa) => {
            selectStuScoreNa.removeEventListener('click', null);
            const options_list = selectStuScoreNa.nextElementSibling;
            options_list.querySelectorAll('.optionStuScore').forEach((option) => {
                option.removeEventListener('click', null);
            });
        });

        selectStuScoreNaList.forEach((selectStuScoreNa, seleindex) => {
            const options_list = selectStuScoreNa.nextElementSibling;
            options_list.innerHTML = '';



            data.forEach((item, index) => {
                const bjbh = item.bjbh;
                const bjmc = item.bjmc;

                const option = document.createElement('div');
                option.classList.add('optionStuScore');
                option.innerText = bjmc;


                option.addEventListener('click', () => {
                    const options = options_list.querySelectorAll('.optionStuScore');

                    // 清除之前的选中状态
                    options.forEach((option) => {
                        option.classList.remove('selected');
                    });

                    selectStuScoreNa.querySelector(`#finalStubjmc${seleindex}`).innerHTML = bjmc;
                    $(`#finalStubjbh${seleindex}`).text(bjbh);
                    option.classList.add('selected');
                    options_list.classList.toggle('stuactive');
                    selectStuScoreNa.querySelector('.iconDo').classList.toggle('up');

                    if (seleindex === 0) {
                        console.log(bjbh, bjmc)
                    }
                    console.log(seleindex,index)
                });


                options_list.appendChild(option); // 将新的选项添加到 options-list 元素中
            });

            // 在渲染第一个 options_list 时额外添加一组数据
            if (seleindex === 0) {
                const allClassOption = document.createElement('div');
                allClassOption.classList.add('optionStuScore');
                allClassOption.innerText = '全部班级';
                allClassOption.addEventListener('click', () => {
                    const options = options_list.querySelectorAll('.optionStuScore');

                    // 清除之前的选中状态
                    options.forEach((opt) => {
                        opt.classList.remove('selected');
                    });

                    // 设置选中状态和相应数值
                    selectStuScoreNa.querySelector(`#finalStubjmc${seleindex}`).innerHTML = '全部班级';
                    $(`#finalStubjbh${seleindex}`).text('allClass');
                    allClassOption.classList.add('selected');
                    options_list.classList.toggle('stuactive');
                    selectStuScoreNa.querySelector('.iconDo').classList.toggle('up');

                    console.log('allClass', '全部班级')
                    console.log(seleindex)
                });

                options_list.insertBefore(allClassOption, options_list.firstChild); // 将新的选项添加到 options-list 元素的开头
            }

            // 切换菜单的显示和隐藏

            if(!isone &&seleindex===0 ){
                console.log('不是第一次')
            }else {
                selectStuScoreNa.addEventListener('click', () => {
                    selectStuScoreNaList.forEach((menu) => {
                        if (menu !== selectStuScoreNa) {
                            menu.nextElementSibling.classList.remove('stuactive');
                            menu.querySelector('.iconDo').classList.remove('up');
                        }
                    });

                    options_list.classList.toggle('stuactive');
                    selectStuScoreNa.querySelector('.iconDo').classList.toggle('up');
                });
            }

        });

        isone = false
    }

    //分页功能
    function fenye(classArr) {
        const pageSize = 3; // 每页显示的条目数量
        const tbody = $('tbody');
        const classArrlen = classArr.length
        const trList = tbody.find('tr');
        const totalPages = Math.ceil(classArrlen / pageSize);

        $('.resultye').text(totalPages)
        $('.resultxiang').text(classArrlen)

        function showPage(page) {
            trList.hide().slice((page - 1) * pageSize, page * pageSize).show();
        }

        function createPaginationButtons() {
            const pagination = document.querySelector('.pagination');
            const children = pagination.children;

            // 清空pagination除第一个和最后一个子元素以外的所有子元素
            for (let i = children.length - 2; i > 0; i--) {
                pagination.removeChild(children[i]);
            }

            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.classList.add('page-number');
                li.textContent = i;
                li.addEventListener('click', function () {
                    showPage(i);
                    document.querySelector('.page-number.active').classList.remove('active');
                    this.classList.add('active');
                    currentPage = i;
                    if (currentPage == 1) {
                        $('.page-btn-prev').removeClass('isClick');
                    }
                    if (currentPage < totalPages) {
                        $('.page-btn-next').addClass('isClick');
                    }
                    if (currentPage > 1) {
                        $('.page-btn-prev').addClass('isClick');
                    }
                    if (currentPage >= totalPages) {
                        $('.page-btn-next').removeClass('isClick');
                    }
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
                currentPage--
                showPage(currentPage);
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
                currentPage++
                showPage(currentPage);
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
    }
})
