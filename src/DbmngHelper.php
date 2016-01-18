<?php

/**
 * database helper class
 *
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 * @author Michele Mammini <mamminim@gmail.com>
 */
namespace Dbmng;

class DbmngHelper {
	private $db;
  private $aParam;
  private $app;
  
	public function __construct($app)
	{
    $this->db = $app->getDb();
    $this->aParam = $app->getParam();
    $this->app = $app;
	}
  
  public function exeSingleRest( $table_name, $router )
  {
    $aForm = $this->getFormArrayByName($table_name);
    $aParam = $aForm['table_param'];
    $aParam = str_replace("'",'"',$aParam);
    
    $aP = json_decode($aParam);
    $aPa = Util::toArray($aP);
    
    $dbmng = new Dbmng($this->app, $aForm, $aPa);
    $api = new Api($dbmng);
    $api->exeRest($router);
  }
  
  public function toArray($obj)
  {
    if (is_object($obj)) $obj = (array)$obj;
    if (is_array($obj)) {
        $new = array();
        foreach ($obj as $key => $val) {
            $new[$key] = $this->toArray($val);
        }
    } else {
        $new = $obj;
    }

    return $new;
  }
  
  public function exeAllRest( $router, $aP )
  {
    $sql = "select * from dbmng_tables ";
    $var = array();
    $aTbl = $this->db->select($sql, $var);
    
    for( $nT = 0; $nT < $aTbl['rowCount']; $nT++ )
      {
        $table_name = $aTbl['data'][$nT]['table_name'];
        $this->exeSingleRest( $table_name, $router, $aP );
      }
  }
  
  public function exeAllRest2( $router, $aP )
  {
    $aForms = $this->getAllFormsArray();
    foreach( $aForms as $k => $aForm )
      {
        $dbmng = new Dbmng($this->app, $aForm, $aP);
        $api = new Api($dbmng);
        $api->exeRest($router);
      }
  }
  
  public function getFormArrayById($id_table)
  {
    $exist_id=false;
    
    $aForm = array();
    $sql = "select * from dbmng_tables where id_table=:id_table";
    $var = array(':id_table' => intval($id_table));

    $table = $this->db->select($sql, $var);
    if( $table['rowCount'] > 0 )
      {
        $id_table = $table['data'][0]['id_table'];
        $aForm['id_table'] = $id_table;
        $aForm['table_name']  = $table['data'][0]['table_name']; 
        $aForm['table_label'] = $table['data'][0]['table_label'];
        
        $aForm['table_alias'] = $table['data'][0]['table_name'];
        if( isset($table['data'][0]['table_alias']) )
          {
            $aForm['table_alias'] = $table['data'][0]['table_alias'];
          }
        
        $aForm['table_param'] = $table['data'][0]['param'];
        
        $exist_id = true;
      }
    
    $aFields = array();
    $aPK     = array(); 
    $fields  = $this->db->select("select * from dbmng_fields where id_table=:id_table order by field_order ASC", array(':id_table'=>intval($id_table)));

    for( $nF = 0; $nF < $fields['rowCount']; $nF++ )
      {
        if( $fields['data'][$nF]['pk'] == 1 || $fields['data'][$nF]['pk'] == 2 )
          {
            $aPK[] = $fields['data'][$nF]['field_name'];
          }

        $sLabelLong = ( strlen($fields['data'][$nF]['field_label_long'])>0 ? $fields['data'][$nF]['field_label_long'] : $fields['data'][$nF]['field_label'] );
        $isSearcheable = ( isset($fields['data'][$nF]['is_searchable']) ? ($fields['data'][$nF]['is_searchable']) : "0" );
        $sWidget = ( isset($fields['data'][$nF]['field_widget']) ? $fields['data'][$nF]['field_widget'] : "input" );

        $aArray=array(
          'label' => $fields['data'][$nF]['field_label'], 
          'type' => $fields['data'][$nF]['id_field_type'], 
          'widget' => $sWidget, 
          'value' => null, 
          'nullable' => $fields['data'][$nF]['nullable'], 
          'readonly' => $fields['data'][$nF]['readonly'],
          'default' => $fields['data'][$nF]['default_value'],
          'is_searchable' => $isSearcheable,
          'key' => $fields['data'][$nF]['pk'], 
          'field_function' => $fields['data'][$nF]['field_function'],
          'label_long' => $sLabelLong,
          'skip_in_tbl' => $fields['data'][$nF]['skip_in_tbl'],
          'voc_sql' => $fields['data'][$nF]['voc_sql'] 
        );
        
        if( isset($fields['data'][$nF]['param']) )
          {
            $param = $fields['data'][$nF]['param'];
            $param = str_replace("'",'"',$param);
            
            $js = json_decode($param);
            if( isset($js) )
              {
                foreach( $js as $key => $val )
                  {
                    $aArray[$key] = $val;
                  }
              }
          }

        $aFields[$fields['data'][$nF]['field_name']] = $aArray;
        
        if( $fields['data'][$nF]['field_widget'] == 'select' || $fields['data'][$nF]['field_widget'] == 'select_nm' )
          {
            if( !isset($fields['data'][$nF]['voc_sql']) )
              {
                // sql automatically generated throught standard coding tables definition
                $sVoc = str_replace("id_", "", $fields['data'][$nF]['field_name']);
                $sql  = "select * from $sVoc";
              }
            else
              {
                // sql written in dbmng_fields
                $sql  = $fields['data'][$nF]['voc_sql'];
              }

            //TODO: review the safety of this query
            $rVoc  = $this->db->select($sql, array(), \PDO::FETCH_NUM);
            $aFVoc = array();

            $v       = 0;
            $bVoc = false;
            //echo print_r($aArray);
//             if( isset($aArray['out_type']) )
//               {
//                 //echo "----------------out_type ------------------------";
//                 if($aArray['out_type'] == 'image' )
//                   {
//                       //echo "----------------image ------------------------";
//                       foreach($rVoc as $val)
//                         {
//                           $keys=array_keys((array)$val);
//                           $aVal = array();
//                           $aVal['image'] = $val->$keys[1];
//                           $aVal['title'] = $val->$keys[2];
//                           
//                           $keys=array_keys((array)$val);
//                           $aFVoc[$val->$keys[0]] = $aVal;
//                         }
//                       $bVoc = true;
//                   }
//               }
            
            if( !$bVoc )
              {
                for( $v = 0; $v < $rVoc['rowCount']; $v++ )
                  {
                    $aFVoc[$rVoc['data'][$v][0]] = $rVoc['data'][$v][1];
                  }
              }
            
            $aFields[$fields['data'][$nF]['field_name']]['voc_val'] = $aFVoc;
          }
        
        if( $fields['data'][$nF]['field_widget'] == 'multiselect' )
          {
            // sql written in dbmng_fields
            $sql  = $fields['data'][$nF]['voc_sql'];

            //TODO: review the safety of this query
            $rVoc  = $this->db->select($sql, array(),PDO::FETCH_NUM);
            $aFVoc = array();

            for( $v = 0; $v < $rVoc['rowCount']; $v++ )
              {
                if( !isset($aFVoc[$rVoc['data'][$v][0]]) )
                  {
                    $aFVoc[$rVoc['data'][$v][0]] = array("key" => $rVoc['data'][$v][0], "value" => $rVoc['data'][$v][1]);
                  }
                if( !isset($aFVoc[$rVoc['data'][$v][0]]["vals"][$rVoc['data'][$v][2]]) )
                  {
                    $aFVoc[$rVoc['data'][$v][0]]["vals"][$rVoc['data'][$v][2]] = array("key" => $rVoc['data'][$v][2], "value" => $rVoc['data'][$v][3]);
                  }
                if( !isset($aFVoc[$rVoc['data'][$v][0]]["vals"][$rVoc['data'][$v][2]]["vals"][$rVoc['data'][$v][4]]) ) 
                  {
                    $aFVoc[$rVoc['data'][$v][0]]["vals"][$rVoc['data'][$v][2]]["vals"][$rVoc['data'][$v][4]] = array("key" => $rVoc['data'][$v][4], "value" => $rVoc['data'][$v][5]);
                  }
              }

            $aFields[$fields['data'][$nF]['field_name']]['voc_val'] = $aFVoc;
          }
      }

    $aForm['primary_key'] = $aPK; 
    if( !array_key_exists('primary_key', $aForm) )
      {
        $aForm['primary_key'] = array('id_' . $aForm['table_name']);  
      }
    
    $aForm['fields'] = $aFields;
    
    if( $exist_id )
      {
        return $aForm;
      }
    else
      {
        return null;
      }
  }
  
  public function getFormArrayByName($table_name)
  {
    $sql = "select * from dbmng_tables where table_name=:table_name";
    $var = array(':table_name' => $table_name);
    $aTbl = $this->db->select($sql, $var);
    
    $id_table = intval($aTbl['data'][0]['id_table']);
    $aForm = $this->getFormArrayById($id_table);
    
    return $aForm;
  }
  
  public function getFormArrayByAlias($alias)
  {
    $sqlc = "select table_alias from dbmng_tables";
    $aCheck = $this->db->select($sqlc, array());
    
    $sql = "select * from dbmng_tables where table_name=:alias";
    if( $aCheck['ok'] )
      {
        $sql = "select * from dbmng_tables where table_alias=:alias";
      }

    $var = array(':alias' => $alias);
    $aTbl = $this->db->select($sql, $var);
    
    $id_table = intval($aTbl['data'][0]['id_table']);
    $aForm = $this->getFormArrayById($id_table);
    
    return $aForm;
  }
  
  public function getAllFormsArray()
  {
    $sql = "select * from dbmng_tables ";
    $var = array();
    $aTbl = $this->db->select($sql, $var);
    
    $aForms = array();
    for( $nT = 0; $nT < $aTbl['rowCount']; $nT++ )
      {
        $table_name = $aTbl['data'][$nT]['table_name'];
        
        $aForms[] = $this->getFormArrayByName($table_name);
      }
    
    return $aForms;
  }
  
}
