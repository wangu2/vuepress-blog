# 4，整合官方在线设计器

## 下载源码

以前几章为基础整合官方的在线设计器，这里使用5.22版本的设计器代码。

打开地址：https://www.activiti.org/get-started，选择 Activiti 5.x Download进行下载。

下列两个为当前要使用到的文件

```
- activiti-5.22.0\wars\activiti-explorer.war
- activiti-5.22.0\libs\activiti-modeler-5.22.0-sources.jar
```

## 在线设计源码

1. 解压War包 activiti-explorer.war （在线设计源码）
2. 将包解压内 diagram-viewer、editor-app、modeler.html 放入SpringBoot静态资源内以直接访问

<img src="/img/image-20200705233655122.png" alt="image-20200705233655122" style="zoom:90%;" />

## 设计器后台源码 

开始提取文件，解压activiti-modeler-5.22.0-sources.jar，打开文件位置

```
目录：activiti-modeler-5.22.0-sources.jarorg\activiti\rest\editor
```

```javascript
文件1：\main\StencilsetRestResource.java （用以汉化）

文件2：\model\ModelEditorJsonRestResource.java （编辑工作流模型）

文件3：\model\ModelSaveRestResource.java（保存工作流模型）
```

该三个文件将是在线设计器要请求的使用的REST，所以将其引入项目中在线设计器。

此时项目会报错缺少jar，pom在对应节点添加以下类库。

```xml
<!-- 统一版本 -->
<properties>
    <activiti.version>6.0.0</activiti.version>
    <xmlgraphics.version>1.7</xmlgraphics.version>
</properties>

<!-- Activiti6.0 相关类库 -->
<dependency>
    <groupId>org.activiti</groupId>
    <artifactId>activiti-spring-boot-starter-basic</artifactId>
    <version>${activiti.version}</version>
</dependency>
<dependency>
    <groupId>org.activiti</groupId>
    <artifactId>activiti-json-converter</artifactId>
    <version>${activiti.version}</version>
    <exclusions>
        <exclusion>
            <groupId>org.activiti</groupId>
            <artifactId>activiti-bpmn-model</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- xml 图像类库 -->
<dependency>
    <groupId>org.apache.xmlgraphics</groupId>
    <artifactId>batik-codec</artifactId>
    <version>${xmlgraphics.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.xmlgraphics</groupId>
    <artifactId>batik-css</artifactId>
    <version>${xmlgraphics.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.xmlgraphics</groupId>
    <artifactId>batik-svg-dom</artifactId>
    <version>${xmlgraphics.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.xmlgraphics</groupId>
    <artifactId>batik-svggen</artifactId>
    <version>${xmlgraphics.version}</version>
</dependency>
```

## 修改引入文件

### *.java 文件修改

上述提到的3个文件是在线设计器会使用到的REST资源

```
StencilsetRestResource.java （用以汉化）

ModelEditorJsonRestResource.java （编辑工作流模型）

ModelSaveRestResource.java（保存工作流模型）
```

这里为了方便管理，为文件统一加上了 /activiti-explorer，（若有权限控制需要将地址进行过滤）

```java
@RequestMapping("/activiti-explorer")
```

### ModelSaveRestResource.java 文件修改

```java
public void saveModel(@PathVariable String modelId, String name, String desc, String json_xml, String svg_xml) {
    try {
      
      Model model = repositoryService.getModel(modelId);
      
      ObjectNode modelJson = (ObjectNode) objectMapper.readTree(model.getMetaInfo());
      
      modelJson.put(MODEL_NAME, name);
      modelJson.put(MODEL_DESCRIPTION, desc);
      model.setMetaInfo(modelJson.toString());
      model.setName(name);
      
      repositoryService.saveModel(model);
      repositoryService.addModelEditorSource(model.getId(), json_xml.getBytes("utf-8"));
      
      InputStream svgStream = new ByteArrayInputStream(svg_xml.getBytes("utf-8"));
      TranscoderInput input = new TranscoderInput(svgStream);
      
      PNGTranscoder transcoder = new PNGTranscoder();
      // Setup output
      ByteArrayOutputStream outStream = new ByteArrayOutputStream();
      TranscoderOutput output = new TranscoderOutput(outStream);
      
      // Do the transformation
      transcoder.transcode(input, output);
      final byte[] result = outStream.toByteArray();
      repositoryService.addModelEditorSourceExtra(model.getId(), result);
      outStream.close();
      
    } catch (Exception e) {
      LOGGER.error("Error saving model", e);
      throw new ActivitiException("Error saving model", e);
    }
  }
```

使用以上函数替换该文件中的函数内容

### *.js 文件修改

Activiti6在线设计器是Angular进行编写的，通过上面操作REST接口已经发生了改变，Js配置需要进行统一。

修改之前在静态目录中引入源文件，修改 \editor-app\app-cfg.js

```javascript
var ACTIVITI = ACTIVITI || {};

ACTIVITI.CONFIG = {
	'contextRoot' : '/activiti-explorer',
};
```

## 在线设计器汉化

```
StencilsetRestResource.java （语言包）
```

```java
/**
 * @author Tijs Rademakers
 */
@RestController
@RequestMapping("/activiti-explorer")
public class StencilsetRestResource {
  
  @RequestMapping(value="/editor/stencilset", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
  public @ResponseBody String getStencilset() {
    InputStream stencilsetStream = this.getClass().getClassLoader().getResourceAsStream("stencilset.json");
    try {
      return IOUtils.toString(stencilsetStream, "utf-8");
    } catch (Exception e) {
      throw new ActivitiException("Error while loading stencil set", e);
    }
  }
}
```

通过源码可以看出会读取文件 stencilset.json ，所以只要文件放入当前Resource根目录即可

## 关系说明

以上是整合官网的在线设计器，可以在线绘图、部署和管理。相较与在IDE绘图，代码发布较为便捷很多。

这章节只是引入到项目中，如果要在项目中进行使用还需要自己再实现，后面将编写一个Controller与设计器进行对接。

## 对接在线设计器

创建Controller整合Activiti设计器，index模板

```java
@Controller
@RequestMapping("/activitiExample")
public class ActivitiExampleController {

    //日志
    private static final Logger logger = LoggerFactory.getLogger(ActivitiExampleController.class);

    //流程服务组件：用于流程定义和存取
    @Autowired
    private RepositoryService repositoryService;

    //历史服务组件：用于获取正在运行或已经完成的流程实例的信息
    @Autowired
    private HistoryService historyService;

    //运行时服务组件：提供了启动流程、查询流程实例、设置获取流程实例变量等功能。
    @Autowired
    private RuntimeService runtimeService;

    //数据模型转换
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 首页控制器：获取工作流模型列表控制器
     *
     * @param modelAndView 页面对象
     * @return 返回页面对象
     */
    @RequestMapping("/")
    public ModelAndView index(ModelAndView modelAndView) {
        modelAndView.setViewName("activiti/index");
        //通过流程服务组件获取当前的工作流模型列表
        List<Model> actList = repositoryService.createModelQuery().list();
        modelAndView.addObject("actList", actList);
        return modelAndView;
    }

    /**
     * 跳转编辑器/编辑工作流页面
     *
     * @return
     */
    @GetMapping("/editor")
    public String editor() {
        return "activiti/modeler";
    }

    /**
     * 创建模型
     *
     * @param response
     */
    @RequestMapping("/create")
    public void create(HttpServletResponse response) throws IOException {
        //创建一个空模型
        Model model = repositoryService.newModel();

        //设置一下默认信息
        String modelName = "new-model";//模型名称
        String modelKey = "new-key";// 模型key
        String modelDescription = ""; //模型描述
        int modelVersion = 1; //默认版本号


        ObjectNode modelNode = objectMapper.createObjectNode();
        modelNode.put(ModelDataJsonConstants.MODEL_NAME, modelName);
        modelNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, modelDescription);
        modelNode.put(ModelDataJsonConstants.MODEL_REVISION, modelVersion);
        model.setName(modelName);
        model.setKey(modelKey);
        model.setMetaInfo(modelNode.toString());
        repositoryService.saveModel(model);
        createObjectNode(model.getId());
        response.sendRedirect("/activitiExample/editor?modelId=" + model.getId());
        logger.info("创建模型结束，返回模型ID：{}", model.getId());
    }

    /**
     * 创建模型时完善ModelEditorSource
     *
     * @param modelId
     */
    @SuppressWarnings("/deprecation")
    private void createObjectNode(String modelId) {
        logger.info("创建模型完善ModelEditorSource入参模型ID：{}", modelId);
        ObjectNode editorNode = objectMapper.createObjectNode();
        editorNode.put("id", "canvas");
        editorNode.put("resourceId", "canvas");
        ObjectNode stencilSetNode = objectMapper.createObjectNode();
        stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
        editorNode.put("stencilset", stencilSetNode);
        try {
            repositoryService.addModelEditorSource(modelId, editorNode.toString().getBytes("utf-8"));
        } catch (Exception e) {
            logger.info("创建模型时完善ModelEditorSource服务异常：{}", e);
        }
        logger.info("创建模型完善ModelEditorSource结束");
    }

    /**
     * 发布流程
     *
     * @param modelId 模型ID
     * @return
     */
    @ResponseBody
    @RequestMapping("/publish")
    public Object publish(String modelId) {
        logger.info("流程部署入参modelId：{}", modelId);
        Map<String, String> map = new HashMap<String, String>();
        try {
            Model modelData = repositoryService.getModel(modelId);
            byte[] bytes = repositoryService.getModelEditorSource(modelData.getId());
            if (bytes == null) {
                logger.info("部署ID:{}的模型数据为空，请先设计流程并成功保存，再进行发布", modelId);
                map.put("code", "FAILURE");
                return map;
            }
            JsonNode modelNode = new ObjectMapper().readTree(bytes);
            BpmnModel model = new BpmnJsonConverter().convertToBpmnModel(modelNode);
            Deployment deployment = repositoryService.createDeployment()
                    .name(modelData.getName())
                    .addBpmnModel(modelData.getKey() + ".bpmn20.xml", model)
                    .deploy();
            modelData.setDeploymentId(deployment.getId());
            repositoryService.saveModel(modelData);
            map.put("code", "SUCCESS");
        } catch (Exception e) {
            logger.info("部署modelId:{}模型服务异常：{}", modelId, e);
            map.put("code", "FAILURE");
        }
        logger.info("流程部署出参map：{}", map);
        return map;
    }

    /**
     * 撤销流程定义
     *
     * @param modelId 模型ID
     * @return
     */
    @ResponseBody
    @RequestMapping("/revokePublish")
    public Object revokePublish(String modelId) {
        logger.info("撤销发布流程入参modelId：{}", modelId);
        Map<String, String> map = new HashMap<String, String>();
        Model modelData = repositoryService.getModel(modelId);
        if (null != modelData) {
            try {
                /**
                 * 参数不加true:为普通删除，如果当前规则下有正在执行的流程，则抛异常
                 * 参数加true:为级联删除,会删除和当前规则相关的所有信息，包括历史
                 */
                repositoryService.deleteDeployment(modelData.getDeploymentId(), true);
                map.put("code", "SUCCESS");
            } catch (Exception e) {
                logger.error("撤销已部署流程服务异常：{}", e);
                map.put("code", "FAILURE");
            }
        }
        logger.info("撤销发布流程出参map：{}", map);
        return map;
    }

    /**
     * 删除流程实例
     *
     * @param modelId 模型ID
     * @return
     */
    @ResponseBody
    @RequestMapping("/delete")
    public Object deleteProcessInstance(String modelId) {
        logger.info("删除流程实例入参modelId：{}", modelId);
        Map<String, String> map = new HashMap<String, String>();
        Model modelData = repositoryService.getModel(modelId);
        if (null != modelData) {
            try {
                //先删除流程实例，再删除工作流模型
                ProcessInstance pi = runtimeService.createProcessInstanceQuery().
                        processDefinitionKey(modelData.getKey()).singleResult();
                if (null != pi) {
                    runtimeService.deleteProcessInstance(pi.getId(), "");
                    historyService.deleteHistoricProcessInstance(pi.getId());
                }
                //删除流程模型
                repositoryService.deleteModel(modelId);
                map.put("code", "SUCCESS");
            } catch (Exception e) {
                logger.error("删除流程实例服务异常：{}", e);
                map.put("code", "FAILURE");
            }
        }
        logger.info("删除流程实例出参map：{}", map);
        return map;
    }
}

```

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.w3.org/1999/xhtml" >
<head>
    <meta charset="UTF-8">
    <title>工作流模型列表</title>

    <!-- 这里设定了项目根路径,后面使用到路径的地方正常填写即可 -->
    <base th:href="${#request.getContextPath()}+'/'">

    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <script src="/js/jquery-3.5.1.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
</head>
<body>
<div class="panel panel-default" style="margin: 10px" >
    <div class="panel-heading">工作流管理</div>
    <div class="panel-body">
        <a href="/activitiExample/create" target="_blank">
            <button type="button" class="btn btn-default" aria-label="Left Align">
                创建模型
            </button>
        </a>
    </div>
    <table class="table">
        <thead>
        <tr>
            <th width="10%">模型编号</th>
            <th width="10%">版本</th>
            <th width="20%">模型key</th>
            <th width="30%">模型名称</th>
            <th width="30%">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr th:each="actModel,actStat:${actList}">
            <th scope="row" th:text="${actModel.id}"></th>
            <td th:text="${actModel.version}"></td>
            <td th:text="${actModel.key}"></td>
            <td th:text="${actModel.name}"></td>
            <td>
                <a th:href="@{'/activitiExample/publish?modelId='+${actModel.id}}" >部署</a>
                <a th:href="@{'/activitiExample/revokePublish?modelId='+${actModel.id}}">撤销</a>
                <a th:href="@{'/activitiExample/editor?modelId='+${actModel.id}}">编辑</a>
                <a th:href="@{'/activitiExample/delete?modelId='+${actModel.id}}">删除</a>
            </td>
        </tr>
        </tbody>
    </table>
</div>
</body>
</html>
```

![image-20200706173135023](/img/image-20200706173135023.png)

![image-20200706173233359](/img/image-20200706173233359.png)

## 总结

所有章节都为简单示例，方便快速入门与了解

需要注意的是，Activiti有自身的一套用户管理，需要和自身系统的用户进行关联、或者做一致操作。

1. 编写流程：针对当前的业务去创建合理的流程（判断条件，会签，回退等一些流程操作）
2. 发布流程：对当前的业务流程进行发布（发布后才可以进行调用和启动）
3. 启动流程：业务表单填写完毕后，根据流程标识进行启动流程
4. 获取任务：获取当前的用户所可操作的任务列表
5. 任务办结：根据任务id进行任务的完成，后进入下一个流程节点或者结束
