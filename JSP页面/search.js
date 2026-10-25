
    let isSear = false  //设置是否查询到了
    searchScoreArr = []  //每次点击查询的时候 先清空 搜索的数组


        //遍历传递过来的班级数组
        scoreArr.forEach((value)=>{  //将查询到的信息添加到搜索数组
            if(value.xh.indexOf(classID) !== -1 || value.xm.indexOf(classID) !== -1){
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
            renderDataToTable(scoreArr)  //渲染所有的数据
            fenye(scoreArr)  //更新分页按钮
        }

//更新下拉框里的数据
    stuClassWrite(bjArr)
