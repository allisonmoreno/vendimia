<?php
defined('BASEPATH') OR exit('No direct script access allowed');
 
require_once APPPATH . "/models/Base_Model.php";

class Clientes_model extends Base_model {
 
    public function __construct(){
        parent::__construct();
        $this->table = 'clientes';
        $this->id_column = 'id_cliente';
    }


    function searchByName($input){
        
        $this->db->select('id_cliente AS value, CONCAT(nombre, \' \', paterno, \' \', materno) AS label, rfc'); 
        $this->db->from($this->table); 
        
        $this->db->like('CONCAT(nombre, \' \', paterno, \' \', materno)', $input); 

        return $this->db->get()->result();
    }
}