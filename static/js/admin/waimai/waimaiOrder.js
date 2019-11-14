$(function(){

    $(document).on('click','#order-grid-open_c0_all',function() {
        var checked=this.checked;
        $("input[name='selectorderl\[\]']:enabled").each(function() {this.checked=checked;});
    });
    $(document).on('click', "input[name='selectorderl\[\]']", function() {
        $('#order-grid-open_c0_all').prop('checked', $("input[name='selectorderl\[\]']").length==$("input[name='selectorderl\[\]']:checked").length);
    });


    $(".chosen-select").chosen();

    //下拉选择控件
    $("#cityid").change(function() {
        location.href = '?state='+state+'&'+$(this).attr('name')+'='+$(this).val();
    })

    //查看订单
	$(".orderdetail").bind("click", function(event){
		event.preventDefault();
		var href = $(this).attr("href"), id = $(this).data("id"), num = $(this).data("num");
		try {
			event.preventDefault();
			parent.addPage("waimaiOrderDetail"+id, "waimai", "订单"+num, "waimai/"+href);
		} catch(e) {}
	});

    // 查看指定用户订单

    $(".searchuid").bind("click", function(event){
        event.preventDefault();
        var href = $(this).attr("href"), username = $(this).attr("data-username"), uid = $(this).attr("data-uid");
        try {
            event.preventDefault();
            parent.addPage("waimaiOrderSearch"+uid, "waimai", username+"的订单", "waimai/"+href);
        } catch(e) {}
    });



    //地图派单
	$("#map").bind("click", function(event){
		event.preventDefault();
		var href = $(this).attr("href");
		try {
			event.preventDefault();
			parent.addPage("waimaiMapAssign", "waimai", "地图派单", "waimai/"+href);
		} catch(e) {}
	});



    //确认订单
    $("#confirmObj").bind("click", function(){
        var data = new Array();
        $("input[name='selectorderl\[\]']:enabled").each(function (){
            if(this.checked == true){
                data.push(this.value);
            }
        });
        if(data.length > 0){

            $.dialog.confirm("是否确认？", function(){
                $.ajax({
                    url: "waimaiOrder.php",
                    type: "post",
                    data: {action: "confirm", id: data.join(",")},
                    dataType: "json",
                    success: function(res){
                        if(res.state != 100){
                            $.dialog.alert(res.info);
                        }else{
                            location.reload();
                        }
                    },
                    error: function(){
                        $.dialog.alert("网络错误，操作失败！");
                    }
                })
            })
            return false;

        }else{
            $.dialog.alert("请选择要操作的订单!");
            return false;
        }
    });



    //成功订单
    $("#okObj").bind("click", function(){
        var data = new Array();
        $("input[name='selectorderl\[\]']:enabled").each(function (){
            if(this.checked == true){
                data.push(this.value);
            }
        });
        if(data.length > 0){

            $.dialog.confirm("是否确认为成功订单？", function(){
                $.ajax({
                    url: "waimaiOrder.php",
                    type: "post",
                    data: {action: "ok", id: data.join(",")},
                    dataType: "json",
                    success: function(res){
                        if(res.state != 100){
                            $.dialog.alert(res.info);
                        }else{
                            location.reload();
                        }
                    },
                    error: function(){
                        $.dialog.alert("网络错误，操作失败！");
                    }
                })
            })
            return false;

        }else{
            $.dialog.alert("请选择要操作的订单!");
            return false;
        }
    });



    //无效订单
    $("#failedObj").bind("click", function(){
        var data = new Array();
        $("input[name='selectorderl\[\]']:enabled").each(function (){
            if(this.checked == true){
                data.push(this.value);
            }
        });
        if(data.length > 0){

            $.dialog.prompt("请输入原因：", function(val){
                $.ajax({
                    url: "waimaiOrder.php",
                    type: "post",
                    data: {action: "failed", id: data.join(","), note: val},
                    dataType: "json",
                    success: function(res){
                        if(res.state != 100){
                            $.dialog.alert(res.info);
                        }else{
                            location.reload();
                        }
                    },
                    error: function(){
                        $.dialog.alert("网络错误，操作失败！");
                    }
                })
            })
            return false;

        }else{
            $.dialog.alert("请选择要操作的订单!");
            return false;
        }
    });



    //打印订单
    $("#printObj").bind("click", function(){
        var data = new Array();
        $("input[name='selectorderl\[\]']:enabled").each(function (){
            if(this.checked == true){
                data.push(this.value);
            }
        });
        if(data.length > 0){

            $.dialog.confirm("是否打印？", function(){
                $.ajax({
                    url: "waimaiOrder.php",
                    type: "post",
                    data: {action: "print", id: data.join(",")},
                    dataType: "json",
                    success: function(res){
                        if(res.state != 100){
                            $.dialog.alert(res.info);
                        }else{
                            $.dialog({
            					title: '提醒',
            					icon: 'success.png',
            					content: '操作成功！'
            				});
                        }
                    },
                    error: function(){
                        $.dialog.alert("网络错误，操作失败！");
                    }
                })
            })
            return false;

        }else{
            $.dialog.alert("请选择要操作的订单!");
            return false;
        }
    });



    //设置配送员
    $("#setCourier").bind("click", function(){
        var data = new Array();
        $("input[name='selectorderl\[\]']:enabled").each(function (){
            if(this.checked == true){
                data.push(this.value);
            }
        });

        var courier_id = $("#courier_id").val();
        if(data.length > 0 && courier_id && courier_id != 0){

            $.dialog.confirm("确定设置？", function(){
                $.ajax({
                    url: "waimaiOrder.php",
                    type: "post",
                    data: {action: "setCourier", id: data.join(","), courier: courier_id},
                    dataType: "json",
                    success: function(res){
                        if(res.state != 100){
                            $.dialog.alert(res.info);
                        }else{
                            location.reload();
                        }
                    },
                    error: function(){
                        $.dialog.alert("网络错误，操作失败！");
                    }
                })
            })
            return false;

        }else{
            $.dialog.alert("请选择要操作的订单和配送员!");
            return false;
        }
    });



    //取消配送员
    $("#cancelCourier").bind("click", function(){
        var data = new Array();
        $("input[name='selectorderl\[\]']:enabled").each(function (){
            if(this.checked == true){
                data.push(this.value);
            }
        });

        if(data.length > 0){

            $.dialog.confirm("确定取消？", function(){
                $.ajax({
                    url: "waimaiOrder.php",
                    type: "post",
                    data: {action: "cancelCourier", id: data.join(",")},
                    dataType: "json",
                    success: function(res){
                        if(res.state != 100){
                            $.dialog.alert(res.info);
                        }else{
                            location.reload();
                        }
                    },
                    error: function(){
                        $.dialog.alert("网络错误，操作失败！");
                    }
                })
            })
            return false;

        }else{
            $.dialog.alert("请选择要操作的订单和配送员!");
            return false;
        }
    });

    // 退款
    $("#list .refund").click(function(){
        var t = $(this), id = t.closest('tr').attr('data-id');
        if(t.hasClass('disabled')) return;
        $.dialog.confirm("确定要退款吗？", function(){
            huoniao.showTip("loading", "操作中···");
            $.ajax({
                url: 'waimaiOrder.php?action=refund&id='+id,
                type: 'post',
                dataType: 'json',
                success: function(data){
                    if(data && data.state == 100){
                        huoniao.showTip("success", "操作成功", "auto");
                        t.closest('tr').find('.refrundState').html('<div class="refundYes">已退款</div>');
                        t.remove();
                    }else{
                        huoniao.showTip("error", data.info, "auto");
                        $.dialog.alert(data.info);
                        t.removeClass('disabled');
                    }
                },
                error: function(){
                    huoniao.showTip("error", "网络错误，操作失败！", "auto");
                    t.removeClass('disabled');
                    $.dialog.alert('网络错误，操作失败！');
                }
            })
        })
    })

    // 快速编辑
    $(".fastedit").blur(function(){
        var t = $(this), id = t.closest("tr").attr("data-id"), val = $.trim(t.text()), val_ = $.trim(t.attr("data-val")), type = $.trim(t.attr("class").replace("fastedit", ""));

        if(val == ""){
            t.val(val_);
        }

        if(val == val_){
            return;
        }

        $.dialog.confirm("确定要修改地址吗？", function(){

            $.ajax({
                url: "waimaiOrder.php",
                type: "post",
                data: {action: "fastedit", id: id, type: type, val: val},
                dataType: "json",
                success: function(res){
                    if(res.state == 100){
                        huoniao.showTip("success", "修改成功！", "auto");
                        t.attr("data-val", val);
                    }else{
                        t.text(val_);
                        huoniao.showTip("error", res.info, "auto");
                    }
                },
                error: function(){
                    t.text(val_);
                    huoniao.showTip("error", "修改失败！", "auto");
                }
            })

        })
    })


});
