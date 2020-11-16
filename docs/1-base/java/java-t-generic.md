# Java - 泛型

::: tip 泛型概念
允许程序员在强类型程序设计语言中编写代码时定义一些可变部分，那些部分在使用前必须作出指明，泛型类是引用类型。( Java 泛型特性是从 JDK1.5 开始加入的 )
:::

[[toc]]

## 泛型存在的意义

> 泛型的本质是为了参数化类型（在不创建新的类型的情况下，通过泛型指定的不同类型来控制形参具体限制的类型）。也就是说在泛型使用过程中，操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法。 

### 适用于多种数据类型执行相同的代码，提高代码的复用性

``` java
private static int add(int a, int b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}

private static float add(float a, float b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}

private static double add(double a, double b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}
```

如果没有泛型，要实现不同类型的加法，每种类型都需要重载一个add方法；通过泛型，我们可以复用为一个方法：

``` java
private static <T extends Number> double add(T a, T b) {
    System.out.println(a + "+" + b + "=" + (a.doubleValue() + b.doubleValue()));
    return a.doubleValue() + b.doubleValue();
}
```

### 泛型中的类型在使用时指定，不需要强制类型转换（类型安全，编译器会检查类型）

``` java
List list = new ArrayList();
list.add("xxString");
list.add(100d);
list.add(new Person());
```

我们在使用上述 list 中，list中的元素都是 Object 类型（无法约束其中的类型），所以在取出集合元素时需要人为的强制类型转化到具体的目标类型，且很容易出现 java.lang.ClassCastException 异常。 

引入泛型，它将提供类型的约束，提供编译前的检查：

``` java
List<String> list = new ArrayList<String>();
// list中只能放String, 不能放其它类型的元素
```

## 泛型基本使用
> 泛型有三种使用方式，分别为：泛型类、泛型接口、泛型方法

### 泛型类
#### 单个泛型类
``` java
// 示例
public class Item<T> {                                  // 此处可以书写为任意标识符号，T 是 type 的简称
    
    private T var;                                      // var 类型由 T 指定，由外部指定

    public T getVar(){                                  // 返回值的类型由外部指定
        return var;
    }

    public T setVar(T var){                             // 赋值的类型由外部指定
        this.var = var;
    }

}

// test
public static void main(String args[]){  
    
    Item<String> item = new Item<String>();             // 里面的var类型为String类型  
    item.setVar("hi");                                 // 设置字符串  
    System.out.println(item.getVar().length());         // 取得字符串的长度  

} 
```

#### 多元泛型
``` java
// 示例
public class Item<K, V> {                                               // 定义两个泛型类型
    
    private K key;                                                      // K，V 类型均由外部指定
    private V val;

    public K getKey(){  
        return this.key;  
    }
    
    public V getValue(){  
        return this.value;  
    }
    
    public void setKey(K key){  
        this.key = key;  
    }

    public void setValue(V value){  
        this.value = value;  
    }

}

// test
public static void main(String args[]){

    Item<String,Integer> item = new Item<String,Integer>();             // 里面的key为String，value为Integer  

    item.setKey("LEE");          // 设置第一个内容
    item.setValue(27);           // 设置第二个内容

}  
```

### 泛型接口
todo

### 泛型方法
todo

## 写在后面
[参考文章-Java基础-泛型机制详解](https://www.pdai.tech/md/java/basic/java-basic-x-generic.html)


## 关键词
> 泛型类、泛型接口、泛型方法