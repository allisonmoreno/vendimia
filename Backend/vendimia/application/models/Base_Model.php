<?php
defined('BASEPATH') OR exit('No direct script access allowed');
 
class Base_Model extends CI_Model {
 
    var $table = '';
    var $relation_table = '';
    var $relation_id = '';
    var $id_column = '';
    var $column_order = array(); //set column field database for datatable orderable
    var $column_search = array(); //set column field database for datatable searchable 
    var $order = array(); // default order 
 
    public function __construct(){
        parent::__construct();
    }

    private function _get_datatables_query(){
        $this->db->from($this->table);
        $i = 0;

        foreach ($this->column_search as $item){ // loop column
            if($_POST['search']['value']){ // if datatable send POST for search 
                 
                if($i===0){ // first loop
                    //$this->db->group_start(); // open bracket. query Where with OR clause better with bracket. because maybe can combine with other WHERE with AND.
                    $this->db->like($item, $_POST['search']['value']);
                }else{
                    $this->db->or_like($item, $_POST['search']['value']);
                }
 
                //if(count($this->column_search) - 1 == $i) //last loop
                //    $this->db->group_end(); //close bracket
            }
            $i++;
        }
         
        if(isset($_POST['order'])){ // here order processing
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        }else if(isset($this->order)){
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }
 
    function get_datatables(){
        $this->_get_datatables_query();
        if($_POST['length'] != -1)
        $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }
 
    function count_filtered(){
        $this->_get_datatables_query();
        $query = $this->db->get();
        return $query->num_rows();
    }
 
    public function count_all(){
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

     function getAll(){
        $this->db->from($this->table);
        return $this->db->get()->result();
    }

    function getByID($id){
        $this->db->from($this->table);
        $this->db->limit(1);
        return $this->db->where($this->id_column,$id)->get()->row();
    }

    function deleteByID($id,$delete_relation = true){
        if($delete_relation && $this->relation_table != '' && ($this->db->from($this->relation_table)->where('FK_'.$this->id_column,$id)->count_all_results() > 0) ){ //tiene alguna relación
            $this->db->where($this->id_column, $id);
            $this->db->update($this->table, ['status' => 0]); //baja lógica
            $mode = 1;
        }else{
            $this->db->delete($this->table, array($this->id_column => $id));  //baja física
            $mode = 2;
        }
        
        return (object)['success' => (($this->db->affected_rows() > 0) ? true : false),'mode' => $mode];
    }

    function reActivate($id){
        $this->db->where($this->id_column, $id);
        $this->db->update($this->table, ['status' => 1]); //alta lógica
        return ($this->db->affected_rows() > 0) ? true : false;
    }

    function addNew($data){
        //echo '<pre>'; print_r($data); echo '</pre>';
        $this->db->insert($this->table, $data); 
        return $this->db->insert_id();
    }

    function update($id,$data){
        $this->db->where($this->id_column, $id);
        $this->db->update($this->table, $data); 
        //echo '<pre>'; print_r($data); echo '</pre>';
        //echo "<h1>".$this->db->last_query()."</h1>";
        //echo "<h1>".$this->db->affected_rows()."</h1>";
        return ($this->db->affected_rows()>0) ? true : false;
    }
}