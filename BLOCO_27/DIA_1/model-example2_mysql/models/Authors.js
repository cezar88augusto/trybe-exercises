const connection = require('./connection');

//Cria uma string com o nome completo do autor

const getNewAuthor = (authorData) => {
    const { id, firstName, middleName, lastName } = authorData;

    const fullName = [firstName, middleName, lastName]
        .filter((name) => name)
        .join(' ');

    return {
        id,
        firstName,
        middleName,
        lastName,
        name: fullName,
    };
};

//Serializa o nome dos campos de snake_case para camelCase

const convertFields = (authorData) => ({
    id: authorData.id,
    firstName: authorData.first_name,
    middleName: authorData.middle_name,
    lastName: authorData.last_name,
});

//Busca todos os autores do banco.

const getAll = async () => {
    const [authors] = await connection.execute(
        'SELECT id, first_name, middle_name, last_name FROM model_example.authors;',
    );
    return authors.map(convertFields).map(getNewAuthor);
};


//Busca um autor específico, a partir do seu ID
//@param {String} id ID do autor a ser recuperado

const findById = async (id) => {
    const [
        authorData,
    ] = await connection.execute(
        'SELECT first_name, middle_name, last_name FROM model_example.authors WHERE id = ?',
        [id],
    );

    if (!authorData) return null;

    const { firstName, middleName, lastName } = authorData.map(convertFields)[0];

    return getNewAuthor({ id, firstName, middleName, lastName });
};

const getByAuthorId = async (authorId) => {
    const query = 'SELECT * FROM model_example.authors WHERE id=?;'
    // O caractere `?` na query será substituído pelo `authorId` que informamos no Array.
    const [author] = await connection.execute(query, [authorId]);

    if(author){
        return true
    }else{
        return false
    }

};


const isValid = (firstName, middleName, lastName) => {
    if (!firstName || typeof firstName !== 'string') return false;
    if (!lastName || typeof lastName !== 'string') return false;
    if (middleName && typeof middleName !== 'string') return false;

    return true;
};

const create = async (firstName, middleName, lastName) => connection.execute(
    'INSERT INTO model_example.authors (first_name, middle_name, last_name) VALUES (?,?,?)',
    [firstName, middleName, lastName],
);

module.exports = {
    getAll,
    findById,
    isValid,
    create,
    getByAuthorId
};