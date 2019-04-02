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
        $names = explode(" ", $input);
        $this->db->select('id_cliente AS id, CONCAT(nombre, \' \', paterno, \' \', materno) AS text',false); 
        $this->db->from($this->table); 
        $i=0;
        $inputs = array('nombre','paterno','materno');

        foreach ($names as $name) {
            foreach ($inputs as $input) {
                if($i==0){
                    $this->db->like($input, $name); 
                }else{
                    $this->db->or_like($input, $name);
                }
                $i++;
            }
        }

        return $this->db->get()->result();
    }
}