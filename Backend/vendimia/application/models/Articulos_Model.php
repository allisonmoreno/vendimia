<?php
defined('BASEPATH') OR exit('No direct script access allowed');
 
require_once APPPATH . "/models/Base_Model.php";

class Articulos_model extends Base_model {
 
    public function __construct(){
        parent::__construct();
        $this->table = 'articulos';
        $this->id_column = 'id_articulo';
        $this->relation_table = 'articulos_ventas';
        $this->relation_id = 'id_articulo';
    }


    function searchByName($input){
        
        $this->db->select('id_articulo AS value, descripcion AS label, modelo, precio, existencia'); 
        $this->db->from($this->table); 
        
        $this->db->like('descripcion', $input); 

        return $this->db->get()->result();
    }
}