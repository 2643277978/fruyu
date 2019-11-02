<?php
/**
 * 添加写字楼
 *
 * @version        $Id: houseXzlAdd.php 2014-1-8 下午16:34:13 $
 * @package        HuoNiao.House
 * @copyright      Copyright (c) 2013 - 2018, HuoNiao, Inc.
 * @link           https://www.ihuoniao.cn/
 */
define('HUONIAOADMIN', "..");
require_once(dirname(__FILE__)."/../inc/config.inc.php");
$dsql = new dsql($dbo);
$tpl = dirname(__FILE__)."/../templates/house";
$huoniaoTag->template_dir = $tpl; //设置后台模板目录
$templates = "houseXzlAdd.html";

$tab = "house_xzl";
$dopost = $dopost ? $dopost : "save";        //操作类型 save添加 edit修改
if($dopost == "edit"){
	$pagetitle = "修改写字楼";
	checkPurview("houseXzlEdit");
}else{
	$pagetitle = "添加写字楼";
	checkPurview("houseXzlAdd");
}

$loupanid = (int)$loupanid;
if(empty($addrid)) $addrid = 0;
if(empty($price)) $price = 0;
if(empty($proprice)) $proprice = 0;
if(empty($weight)) $weight = 1;
if(empty($state)) $state = 0;
if(empty($userid)) $userid = 0;
if(empty($zhuangxiu)) $zhuangxiu = 0;
if(empty($bno)) $bno = 0;
if(empty($floor)) $floor = 0;
if(empty($fg)) $fg = 0;
if(empty($level)) $level = 0;

$config = $_POST['config'];
if(!empty($config)) $config = join(",", $config);

$peitao = $_POST['peitao'];
if(!empty($peitao)) $peitao = join(",", $peitao);

if($_POST['submit'] == "提交"){

	if($token == "") die('token传递失败！');

	if($loupanid == 0){

		if(empty($loupan)){
			echo '{"state": 200, "info": "请输入楼盘名称！"}';
			exit();
		}
		if(empty($addrid)){
			echo '{"state": 200, "info": "请选择所处区域！"}';
			exit();
		}
		if(empty($address)){
			echo '{"state": 200, "info": "请输入详细地址！"}';
			exit();
		}

		//坐标
		if(!empty($lnglat)){
			$lnglat = explode(",", $lnglat);
			$longitude = $lnglat[0];
			$latitude  = $lnglat[1];
		}
		if(empty($longitude) || empty($latitude)){
			echo '{"state": 200, "info": "请选择坐标！"}';
			exit();
		}

	}else{

		$loupanSql = $dsql->SetQuery("SELECT `title`, `cityid`, `addr`, `addrid`, `protype`, `longitude`, `latitude` FROM `#@__house_loupan` WHERE `id` = $loupanid");
		$loupanResult = $dsql->dsqlOper($loupanSql, "results");
		if(!$loupanResult){
			echo '{"state": 200, "info": "楼盘不存在，请重新填写"}';
			exit();
		}
    	$protype_ = $loupanResult[0]['protype'];
    	if(empty($protype_)){
    		echo '{"state": 200, "info": "楼盘不存在，请重新填写"}';
			exit();
    	}
    	$protype_ = explode(",", $protype_);

		$sql = $dsql->SetQuery("SELECT `id` FROM `#@__houseitem` WHERE `parentid` = 1 AND `typename` = '写字楼'");
    	$res = $dsql->dsqlOper($sql, "results");
    	if(!$res){
    		echo '{"state": 200, "info": "楼盘不存在，请重新填写"}';
			exit();
    	}
    	$tid = $res[0]['id'];
    	if(!in_array($tid, $protype_)){
    		echo '{"state": 200, "info": "楼盘不存在，请重新填写"}';
			exit();
    	}
    	$loupan = $loupanResult[0]['title'];
    	$cityid = $loupanResult[0]['cityid'];
    	$addrid = $loupanResult[0]['addrid'];
    	$address = $loupanResult[0]['addr'];
    	$longitude = $loupanResult[0]['longitude'];
    	$latitude = $loupanResult[0]['latitude'];

	}

	//二次验证
	if(empty($title)){
		echo '{"state": 200, "info": "请输入写字楼名称！"}';
		exit();
	}

	if($usertype == 0){
		if(empty($username)){
			echo '{"state": 200, "info": "请输入联系人！"}';
			exit();
		}
		$userSql = $dsql->SetQuery("SELECT `id` FROM `#@__member` WHERE `username` = '".$users."'");
		$userResult = $dsql->dsqlOper($userSql, "results");
		if(!$userResult){
			echo '{"state": 200, "info": "会员不存在，请重新选择"}';
			exit();
		}
		$userSql = $dsql->SetQuery("SELECT `id` FROM `#@__house_zjuser` WHERE `userid` = '".$userResult[0]['id']."'");
		$userResult = $dsql->dsqlOper($userSql, "results");
		if($userResult){
			echo '{"state": 200, "info": "该会员为经纪人，请选择个人会员！"}';
			exit();
		}
		if(empty($contact)){
			echo '{"state": 200, "info": "请输入联系电话！"}';
			exit();
		}
	}else{
		if($userid == 0 && trim($user) == ''){
			echo '{"state": 200, "info": "请选择中介"}';
			exit();
		}
		if($userid == 0){
			$userSql = $dsql->SetQuery("SELECT `id` FROM `#@__member` WHERE `username` = '".$user."'");
			$userResult = $dsql->dsqlOper($userSql, "results");
			if(!$userResult){
				echo '{"state": 200, "info": "会员不存在，请重新选择"}';
				exit();
			}
			$userSql = $dsql->SetQuery("SELECT `id` FROM `#@__house_zjuser` WHERE `userid` = '".$userResult[0]['id']."'");
			$userResult = $dsql->dsqlOper($userSql, "results");
			if(!$userResult){
				echo '{"state": 200, "info": "经纪人不存在，请在联想列表中选择"}';
				exit();
			}

			$userid = $userResult[0]['id'];
		}else{
			$userSql = $dsql->SetQuery("SELECT `id` FROM `#@__house_zjuser` WHERE `id` = ".$userid);
			$userResult = $dsql->dsqlOper($userSql, "results");
			if(!$userResult){
				echo '{"state": 200, "info": "经纪人不存在，请在联想列表中选择"}';
				exit();
			}
		}
	}

	if(trim($note) == ""){
		// echo '{"state": 200, "info": "请输入房源介绍"}';
		// exit();
	}

	// 全景
	$qj_type = (int)$typeidArr;
	if($qj_type == 0){
		$qj_file = $qj_pic;
	}else{
		$qj_file = $qj_url;
	}

	// 201903新增
	$floortype = (int)$floortype;
	$floorspr  = $floortype ? (int)$floorspr : 0;
	$sex       = (int)$sex;
	$wx_tel    = (int)$wx_tel;
	$wuye_in   = (int)$wuye_in;

}

if($dopost == "save" && $submit == "提交"){
	//保存到表
	$archives = $dsql->SetQuery("INSERT INTO `#@__".$tab."` (`cityid`, `type`, `title`, `loupan`, `addrid`, `address`, `nearby`, `litpic`, `proprice`, `protype`, `area`, `price`, `usertype`, `userid`, `username`, `contact`, `zhuangxiu`, `bno`, `floor`, `note`, `mbody`, `weight`, `config`, `state`, `pubdate`, `video`, `qj_type`, `qj_file`, `longitude`, `latitude`, `loupanid`, `fg`, `level`, `peitao`, `floortype`, `floorspr`, `sex`, `wx_tel`, `wuye_in`) VALUES ('$cityid', '$type', '$title', '$loupan', '$addrid', '$address', '$nearby', '$litpic', '$proprice', '$protype', '$area', '$price', '$usertype', '$userid', '$username', '$contact', '$zhuangxiu', '$bno', '$floor', '$note', '$mbody', '$weight', '$config', '$state', '".GetMkTime(time())."', '$video', '$qj_type', '$qj_file', '$longitude', '$latitude', '$loupanid', $fg, $level, '$peitao', '$floortype', '$floorspr', '$sex', '$wx_tel', '$wuye_in')");
	$aid = $dsql->dsqlOper($archives, "lastid");

	//保存图集表
	if($imglist != ""){
		$picList = explode(",",$imglist);
		foreach($picList as $k => $v){
			$picInfo = explode("|", $v);
			$pics = $dsql->SetQuery("INSERT INTO `#@__house_pic` (`type`, `aid`, `picPath`, `picInfo`) VALUES ('housexzl', '$aid', '$picInfo[0]', '$picInfo[1]')");
			$dsql->dsqlOper($pics, "update");
		}
	}

	if($aid){
		adminLog("添加写字楼信息", $title);
		$param = array(
			"service"  => "house",
			"template" => "xzl-detail",
			"id"       => $aid
		);
		$url = getUrlPath($param);

		echo '{"state": 100, "url": "'.$url.'"}';
	}else{
		echo '{"state": 200, "info": '.json_encode("保存到数据库失败！").'}';
	}
	die;
}elseif($dopost == "edit"){

	if($submit == "提交"){
		//保存到表
		$archives = $dsql->SetQuery("UPDATE `#@__".$tab."` SET `cityid` = '$cityid', `type` = '$type', `title` = '$title', `loupan` = '$loupan', `loupanid` = $loupanid, `addrid` = '$addrid', `address` = '$address', `nearby` = '$nearby', `litpic` = '$litpic', `proprice` = '$proprice', `protype` = '$protype', `area` = '$area', `price` = '$price', `usertype` = '$usertype', `userid` = '$userid', `username` = '$username', `contact` = '$contact', `zhuangxiu` = '$zhuangxiu', `bno` = '$bno', `floor` = '$floor', `note` = '$note', `mbody` = '$mbody', `config` = '$config', `weight` = '$weight', `state` = '$state', `pubdate` = '".GetMkTime(time())."', `video` = '$video', `qj_type` = '$qj_type', `qj_file` = '$qj_file', `longitude` = '$longitude', `latitude` = '$latitude', `fg` = $fg, `level` = $level, `peitao` = '$peitao', `floortype` = '$floortype', `floorspr` = '$floorspr', `sex` = '$sex', `wx_tel` = '$wx_tel', `wuye_in` = '$wuye_in' WHERE `id` = ".$id);
		
		$results = $dsql->dsqlOper($archives, "update");

		//先删除文档所属图集
		$archives1 = $dsql->SetQuery("DELETE FROM `#@__house_pic` WHERE `type` = 'housexzl' AND `aid` = ".$id);
		$dsql->dsqlOper($archives1, "update");

		//保存图集表
		if($imglist != ""){
			$picList = explode(",", $imglist);
			foreach($picList as $k => $v){
				$picInfo = explode("|", $v);
				$pics = $dsql->SetQuery("INSERT INTO `#@__house_pic` (`type`, `aid`, `picPath`, `picInfo`) VALUES ('housexzl', '$id', '$picInfo[0]', '$picInfo[1]')");
				$dsql->dsqlOper($pics, "update");
			}
		}

		if($results == "ok"){
			adminLog("修改写字楼信息", $title);
			$param = array(
				"service"  => "house",
				"template" => "xzl-detail",
				"id"       => $id
			);
			$url = getUrlPath($param);

			echo '{"state": 100, "info": '.json_encode('修改成功！').', "url": "'.$url.'"}';
		}else{
			echo $archives;die;
			echo '{"state": 200, "info": '.json_encode('修改失败！').'}';
		}
		die;
	}

	if(!empty($id)){

		//主表信息
		$archives = $dsql->SetQuery("SELECT * FROM `#@__".$tab."` WHERE `id` = ".$id);
		$results = $dsql->dsqlOper($archives, "results");

		if(!empty($results)){

			foreach ($results[0] as $key => $value) {
				${$key} = $value;
			}

			//图表信息
			$archives = $dsql->SetQuery("SELECT * FROM `#@__house_pic` WHERE `type` = 'housexzl' AND `aid` = ".$id." ORDER BY `id` ASC");
			$results = $dsql->dsqlOper($archives, "results");

			if(!empty($results)){
				$imglist = array();
				foreach($results as $key => $value){
					$imglist[$key]["path"] = $value["picPath"];
					$imglist[$key]["info"] = $value["picInfo"];
				}
				$imglist = json_encode($imglist);
			}else{
				$imglist = "''";
			}

		}else{
			ShowMsg('要修改的信息不存在或已删除！', "-1");
			die;
		}

	}else{
		ShowMsg('要修改的信息参数传递失败，请联系管理员！', "-1");
		die;
	}

// 模糊匹配楼盘
}elseif($dopost == "checkLoupan"){
	$key = $_POST['key'];
	$sql = $dsql->SetQuery("SELECT `id`, `loupan`, `addrid`, `address`, `longitude`, `latitude`, `nearby` FROM `#@__house_xzl` WHERE `loupan` != '' AND (`loupan` LIKE '%$key%' || `address` LIKE '%$key%' || `nearby` LIKE '%$key%') GROUP BY `loupan` ORDER BY `id` DESC");
	$res = $dsql->dsqlOper($sql, "results");
	echo json_encode($res ? $res : array());
	die;
// 根据地址id获取名称及父级
}elseif($dopost == "getAddrInfo"){
	$ids = getPublicParentInfo(array("tab" => "site_area", "id" => $id, "split" => " "));
	$names = getPublicParentInfo(array("tab" => "site_area", "id" => $id, "type" => "typename", "split" => "/"));
	echo json_encode(array("ids" => $ids, "names" => $names));
	die;
}

//验证模板文件
if(file_exists($tpl."/".$templates)){

	//js
	$jsFile = array(
		'ui/jquery.dragsort-0.5.1.min.js',
		'ui/bootstrap-datetimepicker.min.js',
		'publicUpload.js',
		'publicAddr.js',
		'admin/house/houseXzlAdd.js'
	);
	$huoniaoTag->assign('jsFile', includeFile('js', $jsFile));

	$huoniaoTag->assign('dopost', $dopost);
	require_once(HUONIAOINC."/config/house.inc.php");
	global $customUpload;
	if($customUpload == 1){
		global $custom_thumbSize;
		global $custom_thumbType;
		global $custom_atlasSize;
		global $custom_atlasType;
		$huoniaoTag->assign('thumbSize', $custom_thumbSize);
		$huoniaoTag->assign('thumbType', "*.".str_replace("|", ";*.", $custom_thumbType));
		$huoniaoTag->assign('atlasSize', $custom_atlasSize);
		$huoniaoTag->assign('atlasType', "*.".str_replace("|", ";*.", $custom_atlasType));
	}
	$huoniaoTag->assign('id', $id);

	//供求方式
	$huoniaoTag->assign('typeopt', array('0', '1'));
	$huoniaoTag->assign('typenames',array('出租','出售'));
	$huoniaoTag->assign('type', $type == "" ? 0 : $type);

	$huoniaoTag->assign('title', $title);
	$huoniaoTag->assign('loupan', $loupan);
	//区域
	$huoniaoTag->assign('addrListArr', json_encode($dsql->getTypeList(0, "houseaddr")));
	$huoniaoTag->assign('addrid', $addrid == "" ? 0 : $addrid);
	$huoniaoTag->assign('address', $address);
    $huoniaoTag->assign('cityid', $cityid);
	$huoniaoTag->assign('nearby', $nearby);

	$huoniaoTag->assign('litpic', $litpic);
	$huoniaoTag->assign('price', $price == 0 ? 0 : $price);
	$huoniaoTag->assign('proprice', $proprice == 0 ? "" : $proprice);

	//物业类型
	$archives = $dsql->SetQuery("SELECT * FROM `#@__houseitem` WHERE `parentid` = 8 ORDER BY `weight` ASC");
	$results = $dsql->dsqlOper($archives, "results");
	$list = array();
	foreach($results as $value){
		$list[$value['id']] = $value['typename'];
	}
	$huoniaoTag->assign('protypeList', $list);
	$huoniaoTag->assign('protype', $protype == "" ? 0 : $protype);

	$huoniaoTag->assign('area', $area);

	//房源性质
	$huoniaoTag->assign('usertypeopt', array('0', '1'));
	$huoniaoTag->assign('usertypenames',array('个人','中介'));
	$huoniaoTag->assign('usertype', $usertype == "" ? 0 : $usertype);

	$huoniaoTag->assign('userid', $userid);
	$huoniaoTag->assign('contact', $contact);
	$huoniaoTag->assign('username', $username);
	if($usertype == 0){
		$userSql = $dsql->SetQuery("SELECT `username`, `phone` FROM `#@__member` WHERE `id` = ". $userid);
		$username = $dsql->getTypeName($userSql);
		$huoniaoTag->assign('user', $username[0]["username"]);
	}else{
		//会员
		$userSql = $dsql->SetQuery("SELECT `userid` FROM `#@__house_zjuser` WHERE `id` = ". $userid);
		$username = $dsql->getTypeName($userSql);
		if($username){
			$userSql = $dsql->SetQuery("SELECT `username`, `phone` FROM `#@__member` WHERE `id` = ". $username[0]["userid"]);
			$username = $dsql->getTypeName($userSql);
			$huoniaoTag->assign('user', $username[0]["username"]);
		}
	}

	//装修情况
	$archives = $dsql->SetQuery("SELECT * FROM `#@__houseitem` WHERE `parentid` = 2 ORDER BY `weight` ASC");
	$results = $dsql->dsqlOper($archives, "results");
	$list = array(0 => '请选择');
	foreach($results as $value){
		$list[$value['id']] = $value['typename'];
	}
	$huoniaoTag->assign('zhuangxiuList', $list);
	$huoniaoTag->assign('zhuangxiu', $zhuangxiu == "" ? 0 : $zhuangxiu);

	$list = array(0 => "请选择", 1 => "可分割", 2 => "不可分割");
	$huoniaoTag->assign('fgList', $list);
	$huoniaoTag->assign('fg', $fg == "" ? 0 : $fg);

	$list = array(0 => "请选择", 1 => "A级", 2 => "B级", 3 => "C级");
	$huoniaoTag->assign('levelList', $list);
	$huoniaoTag->assign('level', $level == "" ? 0 : $level);

	$huoniaoTag->assign('bno', $bno);
	$huoniaoTag->assign('floor', $floor);
	$huoniaoTag->assign('note', $note);
	$huoniaoTag->assign('mbody', $mbody);
	$huoniaoTag->assign('weight', $weight == "" ? "50" : $weight);

	//配置
	$archives = $dsql->SetQuery("SELECT * FROM `#@__houseitem` WHERE `parentid` = 93 ORDER BY `weight` ASC");
	$results = $dsql->dsqlOper($archives, "results");
	$configlist = array();
	$configval  = array();
	foreach($results as $value){
		array_push($configlist, $value['typename']);
		array_push($configval, $value['id']);
	}
	$huoniaoTag->assign('configlist', $configlist);
	$huoniaoTag->assign('configval', $configval);
	$huoniaoTag->assign('config', explode(",", $config));

	// 配套设施 同 house.class.php
	$peitaoCfg = array(
		0 => array("type" => "ict", "name" => "员工餐厅"),
		1 => array("type" => "ift", "name" => "扶梯"),
		2 => array("type" => "ibg", "name" => "办公家具"),
		3 => array("type" => "ign", "name" => "集中供暖"),
		4 => array("type" => "ikt", "name" => "中央空调"),
		5 => array("type" => "ielectric", "name" => "电"),
		6 => array("type" => "iht", "name" => "货梯"),
		7 => array("type" => "iketi", "name" => "客梯"),
		8 => array("type" => "itel", "name" => "电话"),
		9 => array("type" => "ikd", "name" => "宽带"),
		10 => array("type" => "itv", "name" => "有线电视"),
		11 => array("type" => "iwater", "name" => "水"),
		12 => array("type" => "ijk", "name" => "监控"),
		13 => array("type" => "ipark", "name" => "车位"),
	);
	$peitaolist = array();
	$peitaoval = array();
	foreach ($peitaoCfg as $key => $value) {
		$peitaolist[] = $value['name'];
		$peitaoval[] = $key;
	}
	$huoniaoTag->assign('peitaolist', $peitaolist);
	$huoniaoTag->assign('peitaoval', $peitaoval);
	$huoniaoTag->assign('peitao', explode(",", $peitao));

	//显示状态
	$huoniaoTag->assign('stateopt', array('0', '1', '2'));
	$huoniaoTag->assign('statenames',array('待审核','已审核','审核拒绝'));
	$huoniaoTag->assign('state', $state == "" ? 1 : $state);

	// 视频 -------------
	$huoniaoTag->assign('video', $video);

	// 全景 -------------
	$huoniaoTag->assign('qj_type', (int)$qj_type);
	$huoniaoTag->assign('qj_file', $qj_file);
	$huoniaoTag->assign('typeidArr', array('0', '1'));
	$huoniaoTag->assign('typeidNames',array('图片','url'));

	$huoniaoTag->assign('loupanid', (int)$loupanid);
	$huoniaoTag->assign('loupan', $loupan);

	$huoniaoTag->assign('lnglat', $longitude.','.$latitude);

	$huoniaoTag->assign('imglist', empty($imglist) ? "''" : $imglist);


	$huoniaoTag->assign('floorspr', $floorspr);
	$huoniaoTag->assign('sex', $sex);

	// 单层跃层
	$huoniaoTag->assign('floortypeNames', array("单层", "跃层"));
	$huoniaoTag->assign('floortypeOpt', array("0", "1"));
	$huoniaoTag->assign('floortype', $floortype == "" ? 0 : (int)$floortype);

	// 价格是否包含物业费
	$huoniaoTag->assign('wuye_inNames', array("包含", "不含"));
	$huoniaoTag->assign('wuye_inOpt', array("1", "0"));
	$huoniaoTag->assign('wuye_in', $wuye_in == "" ? 0 : (int)$wuye_in);

	// 手机即微信
	$huoniaoTag->assign('wx_telNames', array("是", "否"));
	$huoniaoTag->assign('wx_telOpt', array("1", "0"));
	$huoniaoTag->assign('wx_tel', $wx_tel == "" ? 0 : (int)$wx_tel);

	// 联系人性别
	$huoniaoTag->assign('sexNames', array("男", "女"));
	$huoniaoTag->assign('sexOpt', array("1", "2"));
	$huoniaoTag->assign('sex', $sex == "" ? 0 : (int)$sex);

	$huoniaoTag->compile_dir = HUONIAOROOT."/templates_c/admin/house";  //设置编译目录
	$huoniaoTag->display($templates);
}else{
	echo $templates."模板文件未找到！";
}
