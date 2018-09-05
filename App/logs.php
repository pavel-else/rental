<?php

trait Logs
{
    private function writeLog($log) {
        $this->logs[] = $log;
    }

    private function getLogs() {
        $this->response['logs'] = $this->logs;
    }
}

?>