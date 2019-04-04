<?php
defined('BASEPATH') OR exit('No direct script access allowed');
 
require_once APPPATH . "/models/Base_Model.php";

class Ventas_model extends Base_model {
 
    public function __construct(){
        parent::__construct();
        $this->table = 'ventas';
        $this->id_column = 'id_venta';
        $this->relation_table = 'articulos_ventas';
        $this->relation_id = 'id_articulo';
    }

    function getVentas(){
        $this->db->from($this->table);
        $this->db->select($this->table.".*, CONCAT(clientes.nombre, ' ', clientes.paterno, ' ', clientes.materno) AS nombre");
        $this->db->join('clientes', 'clientes.id_cliente = '.$this->table.'.FK_id_cliente');
        return $this->db->get()->result();
    }

    function setArticulos($id_venta, $articulos){
       foreach ($articulos as $key => $articulo) {
           $this->db->insert($this->relation_table, [$this->relation_id => $articulo["value"], $this->id_column => $id_venta, 'cantidad' =>  $articulo["cantidad"]]); 
       }
    }


}