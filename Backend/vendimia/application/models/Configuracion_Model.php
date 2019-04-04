<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . "/models/Base_Model.php";

 
class Configuracion_Model extends Base_Model {
 
    public function __construct(){
        parent::__construct();
        $this->table = 'configuracion';
        $this->id_column = 'id';
    }

    function getConfiguracion(){
    	$config = [];
    	$this->db->select('valor, slug'); 
        $this->db->from($this->table); 
        
        foreach ($this->db->get()->result() as $key => $value) {
        	$config[$value->slug] = (float)$value->valor;
        }

        return $config;
    }


}