<?php

namespace Drupal\mod_aedit_dbmng\PathProcessor;
use Drupal\Core\PathProcessor\InboundPathProcessorInterface;
use Symfony\Component\HttpFoundation\Request;

class AeditDBMNGPathProcessor implements InboundPathProcessorInterface {

  public function processInbound($path, Request $request) {
    if (strpos($path, '/api_mod_aedit_dbmng/') === 0) {
      $names = preg_replace('|^\/api_mod_aedit_dbmng\/|', '', $path);
      $names = str_replace('/',':', $names);
      return "/api_mod_aedit_dbmng/$names";
    }
    return $path;
  }

}
