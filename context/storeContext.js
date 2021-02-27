import React, {useState, createContext, useEffect} from 'react';
import axios from 'axios';

export const API_URL =
  'https://api.mercadolibre.com/sites/MLA/search?q=Motorola%20G6';

export const StoreContext = createContext();

export const StoreProvider = ({children}) => {
  const [productos, setProductos] = useState([]);
  
  const [categorias, setCategorias] = useState([
    {nombre: 'Categoria 1', color: 'red', id: Math.random().toString(10)},
    {nombre: 'Categoria 2', color: 'blue', id: Math.random().toString(10)},
    {nombre: 'Categoria 3', color: 'green', id: Math.random().toString(10)},
    {nombre: 'Categoria 4', color: 'yellow', id: Math.random().toString(10)},
  ]);

  const [compradores, setCompradores] = useState([
    {nombre: 'Federico Gauchat', email: 'federico@gmail.com', id: Math.random().toString(10)},
    {nombre: 'Lucia Leites', color: 'lucia@gmail.com', id: Math.random().toString(10)},
    {nombre: 'Gabriel Piedrabuena', color: 'gabriel@gmail.com', id: Math.random().toString(10)},
    {nombre: 'Rodrigo Castillo', color: 'rodrigo@gmail.com', id: Math.random().toString(10)},
    {nombre: 'Natalia Gonzalez', color: 'natalia@gmail.com', id: Math.random().toString(10)},
    {nombre: 'German Espinoza', color: 'german@gmail.com', id: Math.random().toString(10)},
  ]);

  const [categoriasProductos, setCategoriasProductos] = useState({});
  const [compradoresProductos, setCompradoresProductos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductos(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const agregarProductoACategoria = (categoria, producto) => {
    if (!categoria?.id || !producto?.id) {
      return; // No hay id de categoria o producto
    }

    const categoriaProductos = categoriasProductos[categoria.id] ?? [];
    if (!categoriaProductos.includes(producto.id)) {
      //Si no esta lo agregamos
      const newCategoriasProductos = {
        ...categoriasProductos,
        [categoria.id]: [...categoriaProductos, producto.id],
      };
      setCategoriasProductos(newCategoriasProductos);
    }
  };

  const quitarProductoDeCategoria = (categoria, producto) => {
    if (!categoria?.id || !producto?.id) {
      return; // No hay id de categoria o producto
    }
    const categoriaProductos = categoriasProductos[categoria.id] ?? [];
    if (categoriaProductos.includes(producto.id)) {
      //Si esta lo quitamos
      setCategoriasProductos({
        ...categoriasProductos,
        [categoria.id]: categoriaProductos.filter((pid) => pid !== producto.id),
      });
    }
  };

  const obtenerCategoriasDelProducto = (producto) => {
    const categoriasId = Object.keys(categoriasProductos);
    const categoriasIdDelProducto = categoriasId.reduce(
      (acc, cur) =>
        categoriasProductos[cur].includes(producto.id) ? [...acc, cur] : acc,
      [],
    );
    const results = categorias.filter((c) =>
      categoriasIdDelProducto.includes(c.id),
    );
    return results;
  };

  const agregarCompradorAProducto = (comprador, producto) => {
    if (!comprador?.id || !producto?.id) {
      return; 
    }

    const compradorProductos = compradoresProductos[producto.id] ?? [];
    if (!compradorProductos.includes(comprador.id)) {
      
      const newCompradoresProductos = {
        ...compradoresProductos,
        [producto.id]: [...compradorProductos, comprador.id],
      };
      setCompradoresProductos(newCompradoresProductos);
    }
  };

  const quitarCompadorDeProducto = (comprador, producto) => {
    if (!comprador?.id || !producto?.id) {
      return; 
    }
    const compradorProductos = compradoresProductos[producto.id] ?? [];
    if (compradorProductos.includes(comprador.id)) {
      
      setcompradoresProductos({
        ...compradoresProductos,
        [producto.id]: compradorProductos.filter((pid) => pid !== comprador.id),
      });
    }
  };

  const obtenerCompradorDelProducto = (comprador) => {
    const compradorId = Object.keys(compradoresProductos);
    const compradorIdDelProducto = compradorId.reduce(
      (acc, cur) =>
        compradoresProductos[cur].includes(comprador.id) ? [...acc, cur] : acc,
      [],
    );
    const results = productos.filter((c) =>
    compradorIdDelProducto.includes(c.id),
    );
    return results;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        productos,
        setProductos,
        categorias,
        setCategorias,
        agregarProductoACategoria,
        quitarProductoDeCategoria,
        obtenerCategoriasDelProducto,
        compradores,
        setCompradores,
        agregarCompradorAProducto,
        quitarCompadorDeProducto,
        obtenerCompradorDelProducto
      }}>
      {children}
    </StoreContext.Provider>
  );
};
