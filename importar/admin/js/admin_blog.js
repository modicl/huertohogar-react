document.addEventListener('DOMContentLoaded', function () {
    // Inicializar Quill
    var quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Escribe el cuerpo de la noticia aquí...',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'blockquote', 'code-block'],
                ['clean']
            ]
        }
    });
    // Manejo del formulario
    document.getElementById('form-blog').addEventListener('submit', function (e) {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        // Obtener HTML del editor
        const cuerpo = quill.root.innerHTML;
        document.getElementById('cuerpo').value = cuerpo;
        const ul = document.getElementById('lista-blog');
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.innerHTML = `<strong>${titulo}</strong>`;
        ul.prepend(li);
        this.reset();
        quill.setContents([]);
        M.updateTextFields();
        M.toast({ html: 'Noticia publicada', classes: 'green' });
    });
});