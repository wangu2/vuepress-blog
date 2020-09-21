# Java - 抽象类与接口

::: tip 基础概念
  抽象类和接口在设计模式以及架构中应用的非常广泛。
:::

[[toc]]

## 抽象类与接口

一个类可以实现多个接口，但类只能继承一个抽象类。

抽象类：抽象类更像是定义类的规范，一旦继承必须全部实现。

### 抽象类（ abstract class ）

使用关键字 **abstract class** 来定义抽象类。抽象类不能被实例，所以抽象类只能被继承。

抽象类中不一定包含抽象方法，但是有抽象方法的类必定是抽象类。


``` java
// 定义
public abstract class Fruit{ 

    // 水果名称、水果分类
    private String name;
    private String type;

    // 初始化
    public Fruit(String name, String type){
        this.name = name;
        this.type = type;
    }

    public String getName(){
        return this.name
    }

    public String getType(){
        return this.type;
    }

}
```

#### 抽象方法 （ abstract void ）

抽象的方法只存在于抽象类中，子类必须重写父类的抽象方法或者自身就是抽象类。

抽象方法只是声明，并不包含方法主体。

``` java
// 定义
public abstract class FruitPlus extends Fruit{ 

    ...

    // 水果的产地
    public abstract void placeOfOrigin(String place);

}
```

::: details 思考
抽象类也是类，它可以被继承（抽象继承抽象）也可以实现接口。抽象类像是定义类的规范，使得继承的子类变的规范。  
:::

### 接口（ Interface ）
接口无法被实例化，但是可以被实现。一个实现接口的类，必须实现接口内所描述的所有方法，否则就必须声明为抽象类。

接口中每一个方法也是隐式抽象的，接口中的方法会被**隐式**的指定为 **public abstract**（只能是 **public abstract**，其他修饰符都会报错）。<br>
接口中可以含有变量，但是接口中的变量会被隐式的指定为 **public static final** 变量（并且只能是 **public**，用 **private** 修饰会报编译错误）。<br>
接口中的方法是不能在接口中实现的，只能由实现接口的类来实现接口中的方法。

>JDK 1.8 以后，接口里可以有静态方法和方法体了。

``` java
// 水果去皮
public interface FruitDecorticate{
    // 声明接口方法
    [public abstract] void decorticate();
}

// 水果去核
public interface FruitEnucleation{
    // 声明接口方法
    [public abstract] void enucleation();
}

// 增强型水果类
public abstract class FruitPlus extends Fruit implements FruitDecorticate, FruitEnucleation { 

    ...

    // 水果的产地
    public abstract void placeOfOrigin(String place);

    // 接口实现
    @Override
    public void decorticate(){
        // 实现 FruitDecorticate 的接口方法
    }

    // 接口实现
    @Override
    public void enucleation(){
        // 实现 FruitEnucleation 的接口方法
    }

}

```

#### 接口多继承
接口支持多继承，使用关键字 **extends** 实现继承父接口的方法。

``` java
// 水果去皮
public interface FruitDecorticate{
    // 声明接口方法
    [public abstract] void decorticate();
}

// 水果去核
public interface FruitEnucleation{
    // 声明接口方法
    [public abstract] void enucleation();
}

// 水果接口多继承 ( 当然 **FruitFun** 也可以拥有自己的方法 )
public interface FruitFun extends FruitDecorticate, FruitEnucleation{}

// 增强型水果类 ( 在这里只需要实现 **FruitFun** 即可拥有 **FruitDecorticate, FruitEnucleation** 接口所声明的方法 )
public abstract class FruitPlus extends Fruit implements FruitFun { 

    ...

    // 水果的产地
    public abstract void placeOfOrigin(String place);

    // 接口实现
    @Override
    public void decorticate(){
        // 实现 FruitDecorticate 的接口方法
    }

    // 接口实现
    @Override
    public void enucleation(){
        // 实现 FruitEnucleation 的接口方法
    }

}

```

::: details 思考
接口增强了类的扩展
:::

### 区别
#### 抽象类与接口
- 抽象类中的成员变量可以是各种类型的，而接口中的成员变量只能是 public static final 类型的
- 一个类只能继承一个抽象类，而一个类却可以实现多个接口

#### 接口与类
- 接口没有构造方法，接口不能被实例
- 接口中所有的方法必须是抽象方法
- 接口不能包含成员变量，除了 static 和 final 变量
- 接口支持多继承（只能继承接口），但类只能继承一个

## 写在后面
- 抽象类定义的意义，解决什么场景？
- 接口定义的意义，解决什么场景？
- 抽象类实现接口的意义是什么？
- 为何会存在多个接口的情况？

## 关键词
> 抽象类、接口、继承、多个接口