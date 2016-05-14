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
  private $aParamDefault;
  private $app;

	public function __construct($app)
	{
    $this->db = $app->getDb();

    $aParam = $app->getParam();
		if(isset($aParam['aParamDefault']))
    	$this->aParamDefault = $aParam['aParamDefault'];
		else
			$this->aParamDefault = Array();

    $this->app = $app;
	}

/*
  public function exeSingleRest( $table_name, $router )
  {
    $aData = $this->getFormArrayByName($table_name);
    $aParam = array_merge($this->aParamDefault, $aData['aParam']);

    $dbmng = new Dbmng($this->app, $aData['aParam'],   $aParam);
    $api = new Api($dbmng);
    $api->exeRest($router);
  }
	*/


	public function exeAllRest( $router, $aForms=null )
  {
  
  //produttore_listino_field/schema
//   $router->any('/api/**', function(){
//     echo "pippo";
//   });
  
  
    if($aForms==null)
    {
      $aForms = $this->getAllFormsArray();
    }

    foreach( $aForms as $k => $aData )
      {
        $dbmng = new Dbmng($this->app, $aData['aForm'], $aData['aParam']);
        $api = new Api($dbmng);
        $api->exeRest($router);
      }
      
    $router->any('/api/**', function() {
        $input = array('ok' => false, 'msg' => 'Table definition not found');
        return json_encode($input);
    });
  }

  public function getFormArrayById($id_table)
  {
    $exist_id=false;

		$aParam=array();
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
            if($table['data'][0]['table_alias']!=null)
              {
                $aForm['table_alias'] = $table['data'][0]['table_alias'];
              }
          }

        if(isset($table['data'][0]['param']))
          {
            $txt=$table['data'][0]['param'];
            $txt = str_replace("'",'"',$txt);
            $aParam= json_decode($txt,true);
          }

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
          'default' => $fields['data'][$nF]['default_value'],
          'is_searchable' => $isSearcheable,
          'key' => $fields['data'][$nF]['pk'],
          'field_function' => $fields['data'][$nF]['field_function'],
          'label_long' => $sLabelLong,
          'skip_in_tbl' => $fields['data'][$nF]['skip_in_tbl'],
          'voc_sql' => $fields['data'][$nF]['voc_sql']
        );

        if(isset( $fields['data'][$nF]['nullable']))
          {
            $aArray['nullable'] = $fields['data'][$nF]['nullable'];
          }

        $aArray['widget'] = $sWidget;
        if(isset( $fields['data'][$nF]['readonly']))
          {
            $aArray['readonly'] = $fields['data'][$nF]['readonly'];
          }

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
            if(isset($fields['data'][$nF]['voc_val']))
              {
                ;//If already exists does not execute a query
              }
            else if( !isset($fields['data'][$nF]['voc_sql']) )
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
            $bOkVoc = $rVoc['ok'];


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

            if( $bOkVoc )
              {
                for( $v = 0; $v < $rVoc['rowCount']; $v++ )
                  {
                    $aFVoc[$rVoc['data'][$v][0]] = $rVoc['data'][$v][1];
                  }
									$aFields[$fields['data'][$nF]['field_name']]['voc_val'] = $aFVoc;
              }

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
        $ret=array();
        $ret['aForm']=$aForm;
        $ret['aParam']=$aParam;
        
        return $ret;
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
    $ret = $this->getFormArrayById($id_table);

    return $ret;
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
    if( $aTbl['rowCount']>0 )
      {
        $id_table = intval($aTbl['data'][0]['id_table']);
        $ret = $this->getFormArrayById($id_table);
      }
    else
      {
        $ret = $this->getFormArrayByName($alias);
      }

    return $ret;
  }

  public function getAllFormsArray()
  {
    $sql = "select * from dbmng_tables ";
    $var = array();
    $aTbl = $this->db->select($sql, $var);

    $aForms = array();
    for( $nT = 0; $nT < $aTbl['rowCount']; $nT++ )
      {
        $id_table = $aTbl['data'][$nT]['id_table'];
        $ret= $this->getFormArrayById($id_table);
        $table_alias=$ret['aForm']['table_alias'];
        $aForms[$table_alias] = $ret;
      }

    return $aForms;
  }
  
  function getTableStructure($id_table, $table_schema = null)
  {
    $bOk = true;
    $aQueries = array();
    $db = $this->db;

    if( $table_schema == null )
    {
      $table_schema = $this->aParamDefault['dbname'];
    }
    
    $sql = "select table_name from dbmng_tables where id_table = :id_table";
    $var = array(':id_table' => $id_table);
    
    $aTable = $this->db->select($sql, $var);
    if( $aTable['rowCount'] > 0 )
      {
        $tn = $aTable['data'][0]['table_name'];
        
        $sql = "select * from information_schema.columns where table_name = :table_name and table_schema = :table_schema";
        $var = array(':table_name' => $tn, ':table_schema' => $table_schema);
        $aFields = $this->db->select($sql, $var);

        for( $nF = 0; $nF < $aFields['rowCount']; $nF++ )
          {
            /* identify the primary key */
            $pk = 0;
            
            if( strlen($aFields['data'][$nF]['COLUMN_KEY']) != 0 )
              {
                if( strlen(trim($aFields['data'][$nF]['EXTRA'])) != 0 )
                  {
                    if( $aFields['data'][$nF]['EXTRA'] == 'auto_increment' )
                      $pk = 1;
                    else
                      $pk = 2;
                  }
              }
            
            /* Map type into crud type */
            $sType ="";
            switch( $aFields['data'][$nF]['DATA_TYPE'] )
              {
                case "int":
                case "bigint":
                  $sType = "int";
                  break;
                case "float":
                case "double":
                  $sType = "double";
                  break;
                case "date":
                  $sType = "date";
                  break;
                case "text":
                  $sType = "text";
                  break;
                default:
                  $sType = "varchar";
              }
            
            /* Assign the 'basic' widget */
            $widget = "";
            $voc_sql = null;
            switch( $aFields['data'][$nF]['DATA_TYPE'] )
              {
                case "int":
                  if( strpos($aFields['data'][$nF]['COLUMN_NAME'], "id_" ) !== false && $pk == 0 )
                    {
                      $widget = "select";
                    }
                  else
                    {
                      $widget = "input";
                    }
                  break;
                case "float":
                  $widget = "input";
                  break;
                case "text":
                  $widget = "textarea";
                  break;
                case "date":
                  $widget = "date";
                  break;
                default:
                  $widget = "input";
              }
            
            /* identify if a fields accept or no to be empty */
            $nullable = 0;
            if( $aFields['data'][$nF]['IS_NULLABLE'] == "YES" && $pk != 1 )
              $nullable = 1;
            
            
            $field_name  = $aFields['data'][$nF]['COLUMN_NAME'];
            $field_label = ucfirst(str_replace("_", " ", $aFields['data'][$nF]['COLUMN_NAME']));
            $field_order = $aFields['data'][$nF]['ORDINAL_POSITION']*10;
            
            /* Prepare insert sql command */
            $sql  = "insert into dbmng_fields( id_table, id_field_type, field_widget, field_name, nullable, field_label, field_order, pk, is_searchable ) ";
            $sql .= "values( :id_table, :id_field_type, :field_widget, :field_name, :nullable, :field_label, :field_order, :pk, :is_searchable );";
            $var = array(':id_table' => $id_table, 
                        ':id_field_type' => $sType, 
                        ':field_widget' => $widget, 
                        ':field_name' => $field_name,
                        ':nullable' => $nullable,
                        ':field_label' => $field_label,
                        ':field_order' => $field_order,
                        ':pk' => $pk,
                        ':is_searchable' => 0);
            $aQueries[$nF]['sql'] = $sql;
            $aQueries[$nF]['var'] = $var;
            
          }
        $ret = $this->db->transactions($aQueries);
      }
    else 
      {
        $ret['ok'] = false;
      }
    return array('ok' => $ret['ok'], 'id_table' => $id_table);
  }
}
