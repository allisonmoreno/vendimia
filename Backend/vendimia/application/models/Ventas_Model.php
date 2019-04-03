<?php
defined('BASEPATH') OR exit('No direct script access allowed');
 
require_once APPPATH . "/models/Base_Model.php";

class Ventas_model extends Base_model {
 
    public function __construct(){
        parent::__construct();
        $this->table = 'ventas';
        $this->id_column = 'id_venta';
        $this->relation_table = 'ventas_ventas';
        $this->relation_id = 'id_venta';
    }

    function getVentas(){
        $this->db->from($this->table);
        $this->db->select($this->table.".*, CONCAT(clientes.nombre, ' ', clientes.paterno, ' ', clientes.materno) AS nombre");
        $this->db->join('clientes', 'clientes.id_cliente = '.$this->table.'.FK_id_cliente');
        return $this->db->get()->result();
    }


}