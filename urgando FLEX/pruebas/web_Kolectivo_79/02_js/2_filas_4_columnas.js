<script>
    function cerrarBombilla() {
        const bombilla = document.getElementById('bombilla');
        bombilla.style.opacity = '0';
        setTimeout(() => bombilla.style.display = 'none', 500);
    }
</script>
