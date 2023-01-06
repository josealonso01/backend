const ProductosDaoMongoDb = require('../daos/ProductsDaos');
const CarritosDaoMongoDb = require('../daos/BasketDaos.js');

const carritosBD = new CarritosDaoMongoDb();
const catalogoController = new ProductosDaoMongoDb();

const findClassName = (clase) => {
  const posExtends = clase.indexOf('extends');
  const firstKey = clase.indexOf('{');
  const className = clase.slice(posExtends + 7, firstKey).trim();
  return className;
};

const classNameCarrito = findClassName(
  carritosBD.constructor.toString()
);
const classNameProducto = findClassName(
  catalogoController.constructor.toString()
);

const createCart = async (req, res) => {
  try {
    const timestamp = Date.now();
    const products = [];
    let idAsignado;
    if (classNameCarrito != 'ContenedorRelacional') {
      idAsignado = await carritosBD.save({ timestamp, products });
    } else {
      idAsignado = await carritosBD.save({ timestamp });
    }
    res.status(200).send({
      status: 200,
      data: {
        idAsignado,
      },
      message: 'carrito creado',
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    let productoAgregarParseado;
    const { id } = req.params;
    const { body } = req;
    const productoAgregar = await catalogoController.getById(
      body.prod_id
    );
    if (productoAgregar) {
      if (classNameProducto === 'ContenedorMongoDb') {
        productoAgregarParseado = {
          id: productoAgregar.id.toString(),
          timestamp: productoAgregar.timestamp,
          name: productoAgregar.name,
          Descripcion: productoAgregar.Descripcion,
          Codigo: productoAgregar.Codigo,
          picture: productoAgregar.picture,
          price: productoAgregar.price,
          stock: productoAgregar.stock,
        };
      } else {
        productoAgregarParseado = { ...productoAgregar };
      }
      const carrito = await carritosBD.getById(id);
      if (carrito) {
        if (classNameCarrito !== 'ContenedorRelacional') {
          const productosEnCarrito = carrito.products;
          if (body.prod_id === productoAgregar._id) {
            res.status(200).send({
              status: 200,
              message: 'este producto ya está en el carro',
            });
            return;
          }
          productosEnCarrito.push(productoAgregarParseado);
          await carritosBD.modify(id, {
            products: productosEnCarrito,
          });
          res.render('cartBasket', {
            productosEnCarrito,
            productoAgregarParseado
          });
         
        } else {
          if (productoAgregar.length !== 0) {
            const productosEnCarrito =
              await productosCarritosBD.getByProp('idCarrito', id);
            for (const prod of productosEnCarrito) {
              if (prod.idProducto == body.id) {
                res.status(200).send({
                  status: 200,
                  message: 'este producto ya está en el carro',
                });
                return;
              }
            }
            await productosCarritosBD.save({
              idCarrito: carrito[0].id,
              idProducto: productoAgregarParseado[0].id,
            });
            res.status(200).send({
              status: 200,
              data: {
                productoAgregado: productoAgregarParseado[0],
              },
              message: 'agregaste un producto a tu carrito',
            });
          } else {
            res.status(200).send({
              status: 200,
              message: 'este producto no existe',
            });
            return;
          }
        }
      } else {
        res.status(200).send({
          status: 200,
          message: 'este carrito no existe',
        });
      }
    } else {
      res.status(200).send({
        status: 200,
        message: 'este producto no existe',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const getAllProductsByCartId = async (req, res) => {
  try {
    const { id } = req.params;
    const carrito = await carritosBD.getById(id);
    let productosEnCarrito = [];
    if (carrito) {
      if (classNameCarrito !== 'ContenedorRelacional') {
        productosEnCarrito = carrito.products;
      } else {
        if (carrito.length !== 0) {
          const productosEnCarro =
            await productosCarritosBD.getByProp('idCarrito', id);
          for (const prod of productosEnCarro) {
            const res = await catalogoController.getById(
              prod.idProducto
            );
            productosEnCarrito.push(res[0]);
          }
          res.status(200).send({
            status: 200,
            data: {
              id: carrito[0].id,
              timestamp: carrito[0].timestamp,
              products: productosEnCarrito,
            },
            message: 'productos del carrito encontrados',
          });
          return;
        } else {
          res.status(200).send({
            status: 200,
            message: 'este carrito no existe',
          });
          return;
        }
      }
      res.render('cartBasket', { productosEnCarrito });
    } else {
      res.status(200).send({
        status: 200,
        message: 'este carrito no existe',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const deleteCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const carrito = await carritosBD.getById(id);
    if (carrito) {
      if (classNameCarrito == 'ContenedorRelacional') {
        if (carrito.length !== 0) {
          await carritosBD.deleteById(id);
          const productosAEliminar =
            await productosCarritosBD.getByProp('idCarrito', id);
          for (const prod of productosAEliminar) {
            await productosCarritosBD.deleteById(prod.id);
          }
        } else {
          res.status(200).send({
            status: 200,
            message: 'este carrito no existe',
          });
          return;
        }
      } else {
        await carritosBD.deleteById(id);
      }
      res.status(200).send({
        status: 200,
        message: 'carrito eliminado',
      });
    } else {
      res.status(200).send({
        status: 200,
        message: 'este carrito no existe',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id, id_prod } = req.params;
    const carrito = await carritosBD.getById(id);
    if (carrito) {
      let productosCarrito = carrito.productos;
      let productoExisteEnCarro;
      let productosAEliminar;
      if (classNameCarrito !== 'ContenedorRelacional') {
        for (const prod of productosCarrito) {
          if (prod.id == id_prod) {
            productoExisteEnCarro = true;
            break;
          }
        }
      } else {
        let parsedProductosAEliminar = [];
        productosAEliminar = await productosCarritosBD.getByProp(
          'idCarrito',
          id
        );
        productosAEliminar.map((item) =>
          parsedProductosAEliminar.push({ ...item })
        );
        productoExisteEnCarro = parsedProductosAEliminar.find(
          (item) => item.idProducto == id_prod
        );
      }
      if (productoExisteEnCarro) {
        if (classNameCarrito !== 'ContenedorRelacional') {
          const newArray = productosCarrito.filter(
            (e) => e.id != id_prod
          );
          await carritosBD.modify(id, { productos: newArray });
          res.status(200).send({
            status: 200,
            message: 'producto eliminado del carro',
          });
        } else {
          for (const prod of productosAEliminar) {
            if (prod.idProducto == id_prod) {
              await productosCarritosBD.deleteById(prod.id);
            }
          }
          res.status(200).send({
            status: 200,
            message: 'producto eliminado del carro',
          });
        }
      } else {
        res.status(200).send({
          status: 200,
          message: 'este producto no existe en el carro',
        });
      }
    } else {
      res.status(200).send({
        status: 200,
        message: 'este carrito no existe',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  getAllProductsByCartId,
  createCart,
  addProduct,
  deleteCartById,
  deleteProductById,
};
