import React, { useState, useEffect } from "react";
import { Tree, Button, Modal, Input, message } from "antd";
import "./ManageCategory.css";
import categoryServer from "../../../../services/category.server";
import AlertNotification from "../../../components/AlertNotification";

const { Search } = Input;

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);  // The filtered categories shown in the UI
  const [initialCategories, setInitialCategories] = useState([]);  // The original categories loaded from API
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [updateCategoryName, setUpdateCategoryName] = useState("");
  const [chooseCategory,setChooseCategory] = useState(null)
  const [updateCategory,setUpdateCategory] = useState(null)
  const [alert,setAlert] = useState(null)
  // Convert API response JSON to Tree data
  const mapCategoriesToTreeData = (categories, level = 1) => {
    return categories.map((category) => ({
      title: category.name,
      key: category.id,
      level: level,
      children: mapCategoriesToTreeData(category.childs || [], level + 1),
    }));
  };

  const fetchCategories = async () => {
    try {
      const apiResponse = await categoryServer.allCategoryAndChild();
      const treeData = mapCategoriesToTreeData(apiResponse);
      setCategories(treeData); // Set filtered categories
      setInitialCategories(treeData); // Store the original categories for reset
    } catch (error) {
      message.error("Failed to fetch categories!");
    }
  };

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const showModal = (category = null) => {
    setCurrentCategory(category);
    setNewCategoryName(""); // Default new category name is empty
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    if (!newCategoryName.trim()) {
      message.error("Category name cannot be empty!");
      return;
    }
  
    const requestBody = {
      name: newCategoryName,
      idParent: currentCategory ? currentCategory.key : null,
    };
    console.log(requestBody)
    try {
      const response = await categoryServer.addCategory(requestBody);
      if(response.status == 200)
        {
          setAlert({message:"Thêm mới danh mục thành công!",type:"success"})
        }else{
          setAlert({message:"Thêm mới danh mục thất bại!",type:"fail"})
        }
  
      // Thêm danh mục mới trực tiếp vào cây danh mục hiện tại
      const newCategory = {
        title: newCategoryName,
        key: `${Date.now()}`, // Backend sẽ trả `id` mới, dùng giả định nếu chưa có
        level: (currentCategory?.level || 0) + 1,
        children: [],
      };
  
      // Cập nhật cây danh mục hiện tại
      const updatedCategories = [...categories];
      if (currentCategory) {
        const updateNode = (nodes) => {
          nodes.forEach((node) => {
            if (node.key === currentCategory.key) {
              node.children = [...(node.children || []), newCategory];
            } else if (node.children) {
              updateNode(node.children);
            }
          });
        };
        updateNode(updatedCategories);
      } else {
        updatedCategories.push(newCategory);
      }
  
      setCategories(updatedCategories); // Cập nhật danh sách
      setIsModalVisible(false); // Đóng modal
  
    } catch (error) {
      message.error("Failed to add category!");
    }
  };
  const handleUpdate = async () => {
    if (!updateCategoryName.trim()) {
      message.error("Category name cannot be empty!");
      return;
    }
  
    const requestBody = {
      name: updateCategoryName,
      id: updateCategory.key, // Đảm bảo truyền đúng ID
    };
  
    try {
      const response = await categoryServer.updateCategory(requestBody);
      if(response.status == 200)
      {
        setAlert({message:"Cập nhật danh mục thành công!",type:"success"})
      }else{
        setAlert({message:"Cập nhật danh mục thất bại!",type:"fail"})
      }

      // Cập nhật lại cây danh mục
      const updatedCategories = updateCategoryInTree(categories, updateCategory.key, updateCategoryName);
      setCategories(updatedCategories); // Render lại giao diện
      setUpdateCategory(null); // Đóng modal chỉnh sửa
    } catch (error) {
      message.error("Failed to update category!"); // Thông báo khi gặp lỗi
    }
  };
  
  const updateCategoryInTree = (nodes, categoryId, newName) => {
    return nodes.map((node) => {
      if (node.key === categoryId) {
        return { ...node, title: newName }; // Cập nhật tên
      }
      if (node.children) {
        return { ...node, children: updateCategoryInTree(node.children, categoryId, newName) }; // Duyệt đệ quy
      }
      return node;
    });
  };

  const handleDelete = async (id) => {
    console.log(id)
    try {
      const response = await categoryServer.deleteCategory(id);
      message.success(response); // Hiển thị thông báo thành công
  
      // Cập nhật danh mục sau khi xóa
      const updatedCategories = deleteCategoryFromTree(categories, id);
      setCategories(updatedCategories); // Cập nhật giao diện
    } catch (error) {
      message.error(error.response?.data || "Failed to delete category!");
    }
  };
  
  // Hàm xóa danh mục trong cây
  const deleteCategoryFromTree = (nodes, categoryId) => {
    return nodes
      .map((node) => {
        if (node.children) {
          node.children = deleteCategoryFromTree(node.children, categoryId);
        }
        return node;
      })
      .filter((node) => node.key !== categoryId); // Loại bỏ danh mục bị xóa
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  
    if (!value.trim()) {
      setCategories(initialCategories); // Hiển thị danh mục gốc khi không tìm kiếm
      return;
    }
  
    const filterTree = (nodes) => {
      return nodes
        .map((node) => {
          if (node.children) {
            const filteredChildren = filterTree(node.children);
            if (
              filteredChildren.length > 0 ||
              node.title.toLowerCase().includes(value.toLowerCase())
            ) {
              return { ...node, children: filteredChildren };
            }
          } else if (node.title.toLowerCase().includes(value.toLowerCase())) {
            return node;
          }
          return null;
        })
        .filter((node) => node !== null);
    };
  
    const filtered = filterTree(initialCategories); // Lọc từ danh sách gốc
    setCategories(filtered);
  };
  

  return (
    <div className="mcp-container">
      {alert && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)} // Đóng thông báo
        />
      )}
      <h1 className="mcp-title">Quản lý Danh mục</h1>
      <div className="mcp-actions">
        <Button
          type="primary"
          onClick={() => showModal()}
          className="mcp-add-category-button"
          style={{backgroundColor:"#ff6600"}}
        >
          Thêm Danh mục gốc
        </Button>
        <Search
          placeholder="Tìm kiếm danh mục"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="mcp-search-input"
          allowClear
          style={{
            position: 'fixed',  // Use 'fixed' to make it stay at the top left even when scrolling
            top: '7%',        // Adjust this to set the distance from the top
            right: '3%',       // Adjust this to set the distance from the left
            zIndex: 1000,       // Optional: Make sure the search bar is on top of other elements
          }}
        />

      </div>
      <div className="mcp-tree-columns">
        {categories.map((parentCategory) => (
          <div className="mcp-tree-column" key={parentCategory.key}>
            <Tree
                treeData={[parentCategory]}
                titleRender={(nodeData) => (
                    <div className="mcp-tree-node">
                    <span
                        className="mcp-tree-title"
                        onClick={() => message.info(`Category: ${nodeData.title}`)}
                        title={nodeData.title} /* Hiển thị tooltip nếu hover */
                    >
                        {nodeData.title}
                    </span>
                    {nodeData.level < 4 && (
                        <Button
                        size="small"
                        type="primary"
                        shape="circle"
                        onClick={() => showModal(nodeData)}
                        className="mcp-add-subcategory-button"
                        >
                        +
                        </Button>
                    )}
                    <div className="mcp-tree-actions">
                        <Button
                        size="small"
                        onClick={() => {setUpdateCategoryName(nodeData.title);setUpdateCategory(nodeData)}}
                        className="mcp-edit-button"
                        >
                        Chỉnh sửa
                        </Button>
                        <Button
                        size="small"
                        danger
                        onClick={() => handleDelete(nodeData.key)}
                        className="mcp-delete-button"
                        >
                        Xóa
                        </Button>
                    </div>
                    </div>
                )}
                />

          </div>
        ))}
      </div>
      <Modal
        title={currentCategory ? "Thêm mới danh mục" : "Thêm mới danh mục gốc"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        className="mcp-modal"
      >
        <Input
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="mcp-input"
        />
      </Modal>

    <Modal
        title={"Chỉnh sửa danh mục"}
        visible={updateCategory!=null}
        onOk={handleUpdate}
        onCancel={() => setUpdateCategory(null)}
        className="mcp-modal"
      >
        <Input
          placeholder="Category Name"
          value={updateCategoryName}
          onChange={(e) => setUpdateCategoryName(e.target.value)}
          className="mcp-input"
        />
      </Modal>
    </div>
  );
};

export default ManageCategory;
