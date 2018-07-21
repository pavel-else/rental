export default function timeFormat(ms /**number*/) {
    if (ms < 0) ms = 0;

    function num(val){
        val = Math.floor(val);
        return val < 10 ? '0' + val : val;
    }
    
    var sec = ms / 1000
      , day = sec / (3600 * 24)
      , hours = sec / 3600  % 24
      , minutes = sec / 60 % 60
      , seconds = sec % 60
    ;

    return num(day)+ " days " + num(hours) + ":" + num(minutes) + ":" + num(seconds);
}
