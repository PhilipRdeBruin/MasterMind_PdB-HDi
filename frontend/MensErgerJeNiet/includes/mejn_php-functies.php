
<?php

    function sessie_init($user) {
        $_SESSION['id'] = $user['id'];
        $_SESSION['gebr_naam'] = $user['gebr_naam'];
        $_SESSION['voornaam'] = $user['voornaam'];
        $_SESSION['naam'] = $user['naam'];
        $_SESSION['rol'] = $_POST['rol'];
    }

    function detSpelerNaam($database, $spelerid) {
        $conn = dbconnect ("sqli", $database);
        $sql = "SELECT * FROM users WHERE id = '$spelerid'";
        $result = $conn->query($sql);

        foreach ($result as $row) {
            $speler["id"] = $spelerid;
            $speler["gebr_naam"] = $row["gebr_naam"];
            $speler["voornaam"] = $row["voornaam"];
            $speler["tussenv"] = $row["tussenv"];
            $speler["achternaam"] = $row["achternaam"];
            $tv = ($row["tussenv"] != "") ? " " . $row["tussenv"] : "";
            $naam = $row["voornaam"] . $tv . " " . $row["achternaam"];
            $speler["naam"] = $naam;
        }

        dbdisconnect ("sqli", $conn);

        return $speler;
    }

    function detSpelerVolgorde($database, $spelid) {

        $conn = dbconnect ("sqli", $database);
        $sql = "SELECT gebr_id FROM users u 
        INNER JOIN actievespelletjes_users au ON au.speler_id = u.id 
        INNER JOIN actievespelletjes a ON au.act_spel_id = a.id
        WHERE a.id = '$spelid' 
        ORDER BY au.id ASC;";
        $result = $conn->query($sql);

        $i = 0;
        foreach ($result as $row) {
            $i++;
            $speler[$i] = $row["gebr_id"];
        }

        dbdisconnect ("sqli", $conn);

        return $speler;
    }

    function fetch_spel_alias($database, $actspelid) {
        $conn = dbconnect ("sqli", $database);
        $sql = "SELECT alias FROM spelletjes s 
                INNER JOIN actievespelletjes a ON a.spel_id = s.id
                WHERE a.id = '$actspelid';";
        $result = $conn->query($sql);

        foreach ($result as $row) { $spel = $row["alias"]; }

        dbdisconnect ("sqli", $conn);

        return $spel;
    }

    function fetch_speler_ids($database, $actspelid) {
        $conn = dbconnect ("sqli", $database);
        $sql = "SELECT u.id FROM users u 
                INNER JOIN actievespelletjes_users au ON au.speler_id = u.id 
                INNER JOIN actievespelletjes a ON au.act_spel_id = a.id
                WHERE a.id = '$actspelid' 
                ORDER BY au.id ASC;";
        $result = $conn->query($sql);

        $i = 0;
        foreach ($result as $row) {
            $i++; 
            $speler[$i] = $row["id"]; 
        }

        dbdisconnect ("sqli", $conn);

        return $speler;
    }


// ***************************************************************************************


    function assign_kleur($spx) {
        $kleurArr = ["blauw", "geel", "groen", "rood"];

        for ($i=0; $i<4; $i++) {
            $spelerAa[$spx[$i]] = $kleurArr[$i];
        }

        return $spelerAa;
    }

    function assign_spelers($kl, $spx) {
        $nsp = count($spx);
        switch ($kl) {
            case "blauw":
                $sp[1] = $spx[1]['naam']; 
                $sp[2] = $spx[2]['naam'];
                $sp[3] = ($nsp >= 3) ? $spx[3]['naam'] : ""; 
                $sp[4] = ($nsp >= 4) ? $spx[4]['naam'] : "";
                break;
            case "geel":
                $sp[1] = $spx[2]['naam']; 
                $sp[2] = ($nsp >= 3) ? $spx[3]['naam'] : "";
                $sp[3] = ($nsp >= 4) ? $spx[4]['naam'] : ""; 
                $sp[4] = $spx[1]['naam'];
                break;
            case "groen":
                $sp[1] = ($nsp >= 3) ? $spx[3]['naam'] : ""; 
                $sp[2] = ($nsp >= 4) ? $spx[4]['naam'] : "";
                $sp[3] = $spx[1]['naam']; 
                $sp[4] = $spx[2]['naam'];
                break;
            case "rood":
                $sp[1] = ($nsp >= 4) ? $spx[4]['naam'] : ""; 
                $sp[2] = $spx[1]['naam'];
                $sp[3] = $spx[2]['naam']; 
                $sp[4] = ($nsp >= 3) ? $spx[3]['naam'] : "";
        }
        // phpAlert("$sp[1], $sp[2], $sp[3], $sp[4]");
        // die();
        return $sp;
    }

    function div_speler_img($pad, $pcl, $naam, $act) {
        if ($naam != "") {
            $imgnaam = str_ireplace(" ", "_", $naam);
            $voornaam = voornaam($naam);

            echo '<div id="card-' . $pcl . '">';
            echo '<p id="foto-hdr' . $act . '">' . $voornaam . '</p>';
            echo '<img class="foto-img" src="' . $pad . '/afbeeldingen/fotos/' . $imgnaam . '.png" alt="foto van ' . $naam . '">';
            echo '</div>';
        } else {
            echo '<div class="card-empty"></div>';
        }
    }


// ***************************************************************************************


    function voornaam($naam) {
        $p = stripos($naam, " ");
        $voornaam = substr($naam, 0, $p + 1);
        return $voornaam;
    }


// ***************************************************************************************


    function dbconnect ($dbconn, $dbname, $servername="localhost") {
        $username = "root";
        $password = "";  //= mysql voor xampp
        $dsn = "mysql:dbname=$dbname;host=$servername";

        if ($dbconn == "sqli") {
            $conn = new mysqli ($servername, $username, $password, $dbname);
            if ($conn->connect_error) {
                phpAlert ("Connection failed");
                die ("Connection failed: " . $conn->connect_error);
            }
        } elseif ($dbconn == "PDO") {
            try {
                $conn = new PDO ($dsn, $username, $password);
                $conn->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            catch (PDOException $e) {
                $msgstr = $sql . "<br>" . $e->getMessage();
                phpAlert ($msgstr);
            }
        }
        return $conn;
    }


    function dbdisconnect ($dbconn, $conn) {
        if ($dbconn == "mysqli") {
            $conn->close();
        } elseif ($dbconn == "PDO") {
            $conn = null;
        }
    }


// ***************************************************************************************


function phpAlert ($msg) {
        echo '<script type="text/javascript">alert("' . $msg . '")</script>';
    }

?>
