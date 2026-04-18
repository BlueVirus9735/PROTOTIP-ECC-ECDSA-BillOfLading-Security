<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER["REQUEST_METHOD"]==="OPTIONS"){http_response_code(200);exit;}
include "db.php";
$data=json_decode(file_get_contents("php://input"),true);
$token=$data["token"]??""; $doc_id=$data["doc_id"]??$data["document_id"]??0; $status=$data["status"]??"";
if(!$token||!$doc_id||!$status){echo json_encode(["status"=>"error","message"=>"Parameter tidak lengkap"]);exit;}
$stmt=$pdo->prepare("SELECT id,role FROM users WHERE session_token=?");$stmt->execute([$token]);$user=$stmt->fetch();
if(!$user){http_response_code(401);echo json_encode(["status"=>"error","message"=>"Sesi tidak valid"]);exit;}
$allowed=["Menunggu Review PHW","Menunggu Pengesahan Kadep","Disahkan"];
if(!in_array($status,$allowed)){echo json_encode(["status"=>"error","message"=>"Status tidak valid"]);exit;}
$stmt=$pdo->prepare("UPDATE documents SET status=?,verified_by=? WHERE id=? AND is_deleted=0");
$stmt->execute([$status,$user["id"],$doc_id]);
if($stmt->rowCount()>0){echo json_encode(["status"=>"success","message"=>"Status diperbarui ke: ".$status]);}
else{echo json_encode(["status"=>"error","message"=>"Dokumen tidak ditemukan"]);}
?>