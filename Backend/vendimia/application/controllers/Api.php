<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct(){
	    header('Access-Control-Allow-Origin: *');
	    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	    header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header("Content-type: application/json");
        header("Cache-Control max-age=3600, must-revalidate");
        header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache"); // HTTP/1.0
        header("Expires: ".gmdate("D, d M Y H:i:s")." GMT"); 
	    parent::__construct();
	}

	public function index(){
		echo json_encode(['success' => true, 'message' => 'Welcome']);
	}

	/*Configuracion */

	public function getClientes(){
        $this->load->database('default');
        $this->load->model('clientes_model','clientes');
        echo json_encode(['success' => true, 'data' => $this->clientes->getAll()]);
        exit();
	}

	/*Configuracion */

	public function getConfiguraciones(){
        $this->load->database('default');
        $this->load->model('configuracion_model','configuracion');
        echo json_encode(['success' => true, 'data' => $this->configuracion->getAll()]);

	}

	public function setConfiguraciones(){
		$post = json_decode(file_get_contents('php://input'), true);
		if (isset($post["params"])){

			$this->load->database('default');
        	$this->load->model('configuracion_model','configuracion');

			foreach ($post["params"] as $key => $value) {
				$this->configuracion->update((int)$value['id'],['valor' => (int)$value['valor']]);
			}
			echo json_encode(['success' => true, 'message' => 'Welcome']);
		}else{
			echo json_encode(['success' => false, 'message' => 'Welcome']);
		}
		exit();
	}
}
