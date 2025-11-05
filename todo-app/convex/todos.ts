import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all todos
export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("desc").collect();
  },
});

// Create a new todo
export const createTodo = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      createdAt: Date.now(),
    });
    return todoId;
  },
});

// Toggle todo completion
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error("Todo not found");
    
    await ctx.db.patch(args.id, {
      completed: !todo.completed,
    });
  },
});

// Delete a todo
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Clear completed todos
export const clearCompleted = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const completedTodos = todos.filter((todo) => todo.completed);
    
    for (const todo of completedTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});

// Update todo text
export const updateTodo = mutation({
  args: { 
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      text: args.text,
    });
  },
});
