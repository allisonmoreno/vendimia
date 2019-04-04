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
        $method = $_SERVER['REQUEST_METHOD'];
	    if($method == "OPTIONS") {
	        die();
	    }
	    parent::__construct();
	}

	public function index(){
		echo json_encode(['success' => true, 'message' => 'Welcome']);
	}

	/*Ventas */

	public function searchClientes($nombre = ""){
        $this->load->database('default');
        $this->load->model('clientes_model','clientes');
        echo json_encode(['success' => true, 'data' => $this->clientes->searchByName($nombre)]);
        exit();
	}

	public function searchArticulos($nombre = ""){
        $this->load->database('default');
        $this->load->model('articulos_model','articulos');
        echo json_encode(['success' => true, 'data' => $this->articulos->searchByName($nombre)]);
        exit();
	}

	public function getVentas(){
        $this->load->database('default');
        $this->load->model('ventas_model','ventas');
        $this->load->model('configuracion_model','configuracion');
        echo json_encode(['success' => true, 'data' => $this->ventas->getVentas(), 'nextID' => ($this->ventas->getLastID() + 1), 'configuracion' => $this->configuracion->getConfiguracion() ]);
        exit();
	}

	public function setVentas(){
		$post = json_decode(file_get_contents('php://input'), true);

		if (isset($post["descripcion"])){
			
			$id_venta = (int)$post["id_venta"];
			unset($post["id_venta"]);
			unset($post["tableData"]);

			$this->load->database('default');
        	$this->load->model('ventas_model','ventas');

			if($id_venta > 0){
				$this->ventas->update($id_venta,$post);
			}else{
				$id_venta = $this->ventas->addNew($post);
			}
			
			echo json_encode(['success' => true, 'message' => 'Artículo agregado', 'id_venta' => $id_venta, 'nextID' => ($this->ventas->getLastID() + 1)]);
		}else{
			echo json_encode(['success' => false, 'message' => 'Hubo un problema al agregar venta']);
		}
		exit();
	}

	/*Articulos */

	public function getArticulos(){
        $this->load->database('default');
        $this->load->model('articulos_model','articulos');
        echo json_encode(['success' => true, 'data' => $this->articulos->getAll(), 'nextID' => ($this->articulos->getLastID() + 1) ]);
        exit();
	}

	public function setArticulos(){
		$post = json_decode(file_get_contents('php://input'), true);

		if (isset($post["descripcion"])){
			
			$id_articulo = (int)$post["id_articulo"];
			unset($post["id_articulo"]);
			unset($post["tableData"]);

			$this->load->database('default');
        	$this->load->model('articulos_model','articulos');

			if($id_articulo > 0){
				$this->articulos->update($id_articulo,$post);
			}else{
				$id_articulo = $this->articulos->addNew($post);
			}
			
			echo json_encode(['success' => true, 'message' => 'Artículo agregado', 'id_articulo' => $id_articulo, 'nextID' => ($this->articulos->getLastID() + 1)]);
		}else{
			echo json_encode(['success' => false, 'message' => 'Hubo un problema al agregar articulo']);
		}
		exit();
	}


	/*Clientes */

	public function getClientes(){
        $this->load->database('default');
        $this->load->model('clientes_model','clientes');
        echo json_encode(['success' => true, 'data' => $this->clientes->getAll(), 'nextID' => ($this->clientes->getLastID() + 1) ]);
        exit();
	}

	public function setClientes(){
		$post = json_decode(file_get_contents('php://input'), true);

		if (isset($post["rfc"])){
			
			$id_cliente = (int)$post["id_cliente"];
			unset($post["id_cliente"]);
			unset($post["tableData"]);

			$this->load->database('default');
        	$this->load->model('clientes_model','clientes');

			if($id_cliente > 0){
				$this->clientes->update($id_cliente,$post);
			}else{
				$id_cliente = $this->clientes->addNew($post);
			}
			
			echo json_encode(['success' => true, 'message' => 'Cliente agregado', 'id_cliente' => $id_cliente, 'nextID' => ($this->clientes->getLastID() + 1)]);
		}else{
			echo json_encode(['success' => false, 'message' => 'Hubo un problema al agregar cliente']);
		}
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
			echo json_encode(['success' => true, 'message' => 'Configuración Guardada.']);
		}else{
			echo json_encode(['success' => false, 'message' => 'Hubo un problema al guardar la configuración.']);
		}
		exit();
	}
}
