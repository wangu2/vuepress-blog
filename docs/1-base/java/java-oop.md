# Java - 面向对象

::: tip 论基础的重要性
一切皆对象，对项目中的事务进行对象化，面向对象的基础概念在**设计模式**中运用的淋漓尽致，当然**设计模式**也运用在架构设计方面。
:::

[[toc]]

## 三大特性
### 封装
将抽象出来的基础属性和方法封装在一起，使其变成一个类。<br/>
基础属性被保护在内部（以 **private** 修饰），用户不需要知道对象内部的细节，将对方法(以 **public** 修饰)暴露给外部使用。


::: details 个人见解

  一个类只描述一个对象，使其对象更加具有目的性，多个对象则通过外部的方法进行关联依赖。

  个人感觉封装的概念其实与面向接口编程类似，系统与系统之间是通过接口访问系统操作。<br>
  也都是暴露给外部让其能够访问交互（Http方式，Rpc方式）。
:::

### 继承
**Is-A（父子继承关系）** ，在代码实现过程中将特征一致的对象属性和方法抽取为父类（ **superClass** 超类）。<br/>
子类只需要继承（以 **extends** 关键字实现）于超类，使子类拥有父类相同的属性及方法（**private** 除外）。

**子类可以拥有自己的属性以及方法，也可以重写父类所提供的方法**。

``` java
// 水果
public class Fruit{ }

// 苹果
public class Apple extends Fruit{ }
// 香蕉
public class Banana extends Fruit{ }

// 向上转型
Fruit fruit = new Apple();
```

Apple 和 Fruit 就是一种 IS-A 关系，因此 Apple 可以继承自 Fruit，从而获得 Fruit 非 private <br/>
继承应该遵循里氏替换原则，子类对象必须能够替换掉所有父类对象。

Apple 可以当做 Fruit 来使用，也就是说可以使用 Fruit 引用 Apple 对象。父类引用指向子类对象称为向上转型 。

::: details 个人见解
  继承提高了代码的复用性，如果有多个子类的话可以轻松定义，向上转型、向下转型也是都是通过继承来实现的，。
:::

### 多态
多态指同一个行为有不同的展现形式，多态分为编译时和运行时状态
- 编译时多态主要是指方法的重载（**同方法名不同参数列表或者个数**）
- 运行时多态体现
  - 继承
  - 重写
  - 向上转型（父类引用指向子类）

``` java
// 水果
public class Fruit{ 
  public void eat(){
    System.out.print("正在吃水果");
  }
}

// 苹果
public class Apple extends Fruit{ 
  public void eat(){
    System.out.print("正在吃苹果");
  }
  public void decorticate(){
    System.out.print("不剥皮也可以吃的");
  }
}

// 香蕉
public class Banana extends Fruit{
  public void eat(){
    System.out.print("正在吃香蕉");
  }
  public void decorticate(){
    System.out.print("吃香蕉的时候要先剥皮");
  }
}

// main
public class Test{
    public static void main(String[] args) {
      
      // 向上转型
      Fruit apple = new Apple();
      apple.eat(); /** 正在吃苹果 */

      // 不剥皮的话就连皮一起吃掉，所以这里要进行剥皮
      Fruit banana = new Banana();
      banana.eat(); /** 正在吃香蕉 */
      
      // 如果要调用父类中没有的方法，则要向下转型
      Banana banana1 = (Banana)banana;
      // 先剥皮再吃
      banana.decorticate(); 
      banana.eat(); 
    }
}
```

::: details 个人见解
  方法的重载使其方法的更加灵活，也具有更强的扩充性，增强了方法的灵活性<br>
  多态的方式在设计模式里非常常见，特别是向上转型的操作。
:::

## 写在后面
在代码开始（如果有充足的时间）或者重构的过程中，多思考一下 oop 的概念，使其自己的代码设计变得更优雅简单，可扩展性更高。

## 关键词
> OOP、设计模式、里氏替换原则、Is-A、工厂模式、方法的重载、向上转型、向下转型