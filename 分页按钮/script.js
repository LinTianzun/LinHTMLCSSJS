const ulTag = document.querySelector("#fenye")// 获取ul元素
let totalPages = 7

function element(totalPages, page) {
    if(page > totalPages){
        page = totalPages
    }
    // ulTag.innerHTML = ''
    let liTag = ''// 存储生成的li标签
    let activeLi; // 标记当前页码是否激活(active)
    let beforePages = page - 1// 当前页码的前一页
    let afterPages = page + 1// 当前页码的后一页

    if (page > 1) {// 如果当前页不是第一页，则在liTag中添加"Prev"按钮
        liTag += `<li class="btn prev" onclick="element(totalPages,${page - 1})"><span><i class="iconfont icon-left"></i> Prev</span></li>`
    }

    if (page > 2) {// 如果当前页码大于2
        if (totalPages > 4) {// 如果总页数大于4 // 添加第一页按钮
            liTag += `<li class="numb" onclick="element(totalPages,1)"><span>1</span></li>`
            if (page > 3) {// 如果当前页码大于3
                if (totalPages > 5) {// 如果总页数大于5 // 添加省略号
                    liTag += `<li class="dots"><span>...</span></li>`
                }
            }
        }
    }

    if (totalPages > 2) {  // 如果总页数大于2
        if (page == totalPages) {
            beforePages = beforePages - 2 // 调整前一页的值
        } else if (page == totalPages - 1) {
            beforePages = beforePages - 1 // 调整前一页的值
        }

        if (page == 1) {
            afterPages = afterPages + 2 // 调整后一页的值
        } else if (page == 2) {
            afterPages = afterPages + 1 // 调整后一页的值
        }
    }

    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
        if (pageLength > totalPages) { // 超过总页数时跳过循环
            continue
        }
        if (pageLength == 0) { // 当页码为0时，将其加1
            pageLength = pageLength + 1
        }
        if (page == pageLength) {  // 如果是当前页码，将activeLi标记为"active"
            activeLi = "active"
        } else { // 否则，将activeLi设置为空字符串
            activeLi = ""
        } // 添加页码按钮到liTag中
        liTag += `<li class="numb ${activeLi}"  onclick="element(totalPages,${pageLength})"><span>${pageLength}</span></li>`
    }

    if (page < totalPages - 1) { // 如果当前页不是倒数第二页
        if (totalPages > 4) { // 如果总页数大于4
            if (page < totalPages - 2) { // 如果当前页码小于总页数减2
                if (totalPages > 5) {   // 如果总页数大于5 // 添加省略号
                    liTag += `<li class="dots"><span>...</span></li>`
                }
            }
            liTag += `<li class="numb" onclick="element(totalPages,${totalPages})"><span>${totalPages}</span></li>`
        }
    }

    if (page < totalPages) { // 如果当前页不是最后一页，则在liTag中添加"Next"按钮
        liTag += `<li class="btn next" onclick="element(totalPages,${page + 1})" ><span>Next <i class="iconfont icon-right"></i></span></li>`
    }

    ulTag.innerHTML = liTag // 将生成的li标签渲染到ul中
}
element(totalPages, 4) // 调用函数生成分页导航