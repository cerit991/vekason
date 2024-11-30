import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Uploads dizinini oluştur ve statik olarak sun
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
    cb(null, true);
  }
});

// Data dizinini ve dosya yollarını ayarla
const DATA_DIR = path.join(__dirname, 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const BRANDS_FILE = path.join(DATA_DIR, 'brands.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Helper functions
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

// Initialize data files
async function initializeDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(uploadsDir, { recursive: true });

    const files = [
      { path: CATEGORIES_FILE, default: [] },
      { path: BRANDS_FILE, default: [] },
      { path: PRODUCTS_FILE, default: [] },
      { path: ORDERS_FILE, default: [] }
    ];

    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await writeJsonFile(file.path, file.default);
      }
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await readJsonFile(CATEGORIES_FILE);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Kategoriler yüklenirken hata oluştu' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const categories = await readJsonFile(CATEGORIES_FILE);
    const newCategory = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      ...req.body
    };
    categories.push(newCategory);
    await writeJsonFile(CATEGORIES_FILE, categories);
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Kategori eklenirken hata oluştu' });
  }
});

// Brands endpoints
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await readJsonFile(BRANDS_FILE);
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Markalar yüklenirken hata oluştu' });
  }
});

app.post('/api/brands', async (req, res) => {
  try {
    const brands = await readJsonFile(BRANDS_FILE);
    const newBrand = {
      id: brands.length > 0 ? Math.max(...brands.map(b => b.id)) + 1 : 1,
      ...req.body
    };
    brands.push(newBrand);
    await writeJsonFile(BRANDS_FILE, brands);
    res.json(newBrand);
  } catch (error) {
    res.status(500).json({ error: 'Marka eklenirken hata oluştu' });
  }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Ürünler yüklenirken hata oluştu' });
  }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE);
    const productData = JSON.parse(req.body.data);
    
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...productData,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    };
    
    products.push(newProduct);
    await writeJsonFile(PRODUCTS_FILE, products);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Ürün eklenirken hata oluştu' });
  }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE);
    const productId = parseInt(req.params.id);
    const productData = JSON.parse(req.body.data);
    
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    const oldProduct = products[index];
    const updatedProduct = {
      ...oldProduct,
      ...productData,
      id: productId
    };

    if (req.file) {
      if (oldProduct.image) {
        const oldImagePath = path.join(__dirname, '..', oldProduct.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      updatedProduct.image = `/uploads/${req.file.filename}`;
    }

    products[index] = updatedProduct;
    await writeJsonFile(PRODUCTS_FILE, products);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Ürün güncellenirken hata oluştu' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = await readJsonFile(PRODUCTS_FILE);
    
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    const product = products[index];

    // Resim dosyasını sil
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Ürünü diziden kaldır
    products.splice(index, 1);
    
    // Değişiklikleri kaydet
    const success = await writeJsonFile(PRODUCTS_FILE, products);
    
    if (!success) {
      throw new Error('Ürün dosyaya kaydedilemedi');
    }

    res.json({ success: true, message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Ürün silinirken hata oluştu' });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readJsonFile(ORDERS_FILE);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Siparişler yüklenirken hata oluştu' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orders = await readJsonFile(ORDERS_FILE);
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      ...req.body
    };
    orders.push(newOrder);
    await writeJsonFile(ORDERS_FILE, orders);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Sipariş oluşturulurken hata oluştu' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const orders = await readJsonFile(ORDERS_FILE);
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Sipariş bulunamadı' });
    }

    order.status = status;
    await writeJsonFile(ORDERS_FILE, orders);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Sipariş durumu güncellenirken hata oluştu' });
  }
});

// Initialize and start server
initializeDataFiles().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Uploads directory: ${uploadsDir}`);
  });
});