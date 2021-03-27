import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';


interface IFood {
  id: Number,
  description: String,
  price: Number,
  image: String
}

interface IEditingFood {
  id: Number
}

export function Dashboard() {

  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IEditingFood>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const response = api.get('/foods');
    response.then(response => {
      setFoods(response.data);
    })
  }, [])

  async function handleAddFood(food: IFood) {

    try {
      const response = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      })

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IFood) {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(food => food.id != foodUpdated.data.id ? food : foodUpdated.data,);

      setFoods(foodsUpdated);

    } catch (err) {
      console.log(err);
    }
  }

  function toogleModal() {
    setIsModalOpen(!isModalOpen);
  }

  function handleEditFood(food: IFood) {
    console.log('test');
    setEditingFood(food);
    setIsEditModalOpen(true);
  }

  async function handleDeleteFood(id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id != id)

    setFoods(foodsFiltered);
  }

  function toggleEditModal() {
    console.log('edit');
    setIsEditModalOpen(!isEditModalOpen);
  }

  return (
    <>
      <Header openModal={toogleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toogleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      <FoodsContainer data-testid="foods-list">
        {foods.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  )
}