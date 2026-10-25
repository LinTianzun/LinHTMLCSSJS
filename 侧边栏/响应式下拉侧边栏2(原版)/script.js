$(".menu > ul > li").click(function (e) {
    // 移除其他兄弟节点的 "active" 类
    $(this).siblings().removeClass("active")
    // 切换当前节点的 "active" 类
    $(this).toggleClass("active")
    // 切换当前节点下的子菜单的显示状态 如果有的话
    $(this).find("ul").slideToggle()
    // 收起其他兄弟节点下的子菜单
    $(this).siblings().find("ul").slideUp()
    // 移除其他兄弟节点下子菜单列表项的 "active" 类
    $(this).siblings().find("ul").find("li").removeClass("active")
})

$(".menu-btn").click(function () {
    $(".sidebar").toggleClass("active")
})