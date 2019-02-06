
<?php
    if (isset($_POST["start_spel"])) {
        $gebr = detSpelerNaam($database, $_POST["speler"]);
        sessie_init($gebr);

        $actspelid = $_POST["act_spel"];
        $spelerid = $_POST["speler"];
        $rol = $_POST["rol"];

        $spelnaam = fetch_spel_alias($database, $actspelid);
        $spelerids = fetch_speler_ids($database, $actspelid);

        $nsplr = 2;
        for ($i = 1; $i <= $nsplr; $i++ ) {
            $spelerx[$i] = detSpelerNaam($database, $spelerids[$i]);
        }
    }
?>

    <div id="server" style="display:none"><?php echo $server ?></div>
    <div id="kamer" style="display:none"><?php echo $actspelid ?></div>
    <div id="spelnaam" style="display:none"><?php echo $spelnaam ?></div>
    <div id="spelerid" style="display:none"><?php echo $spelerid ?></div>
    <div id="gebrvoornaam" style="display:none"><?php echo $gebr['voornaam'] ?></div>
    <div id="gebrnaam" style="display:none"><?php echo $gebr['naam'] ?></div>
    <div id="rol" style="display:none"><?php echo $rol ?></div>

<?php
    for ($i = 1; $i<=$nsplr; $i++) {
        $idx = $spelerx[$i]['id'];
        $vnx = $spelerx[$i]['voornaam'];
        echo '<div id="spelerid' . $i . '" style="display:none">' . $idx . '</div>';
        echo '<div id="spelervn' . $i . '" style="display:none">' . $vnx . '</div>';
    }
?>
