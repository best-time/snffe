

  sass --watch scss/modules:css

@at-root 跳出当前选择器嵌套
默认@at-root只会跳出选择器嵌套，而不能跳出@media或@support，
如果要跳出这两种，则需使用@at-root (without: media)，@at-root (without: support)
这个语法的关键词有四个：all（表示所有），rule（表示常规css），media（表示media），
support（表示support，因为@support目前还无法广泛使用，所以在此不表）
我们默认的@at-root其实就是@at-root (without:rule)

ex: .parent-3 {
      background:#f00;
      @at-root {
        .child1 {
          width:300px;
        }
        .child2 {
          width:400px;
        }
      }
    }

    ======>

    .parent-3 {
      background: #f00;
    }
    .child1 {
      width: 300px;
    }
    .child2 {
      width: 400px;
    }

    @media print {
      .parent2{
        color:#f00;

        @at-root (without: media) {
          .child2 {
            width:200px;
          }
        }
      }
    }

    ======>

    @media print {
      .parent2 {
        color: #f00;
      }
    }
    .parent2 .child2 {
      width: 200px;
    }
    -----------------------------------------------
    list

    $linkColor: #08c #333 !default;//第一个值为默认值，第二个鼠标滑过值
    a{
      color:nth($linkColor,1);

      &:hover{
        color:nth($linkColor,2);
      }
    }

    ========>

    a{
      color:#08c;
    }
    a:hover{
      color:#333;
    }

    -----------------------------------------------
    @mixin

    @mixin center-block {
        margin-left:auto;
        margin-right:auto;
    }
    .demo{
        @include center-block;
    }

    ============>

    .demo{
        margin-left:auto;
        margin-right:auto;
    }

    带参数:

    @mixin opacity($opacity:50) {
      opacity: $opacity / 100;
      filter: alpha(opacity=$opacity);
    }

    ============>

    .opacity{
      @include opacity; //参数使用默认值
    }
    .opacity-80{
      @include opacity(80); //传递参数
    }

    --------------------------------------------------
    @content
    可以用来解决css3的@media等带来的问题。它可以使@mixin接受一整块样式，接受的样式从@content开始

    @mixin max-screen($res){
      @media only screen and ( max-width: $res ) {
        @content;
      }
    }

    @include max-screen(480px) {
      body { color: red }
    }

    =============>

    @media only screen and (max-width: 480px) {
      body { color: red }
    }

    -------------------------------------------------
    @for

    @for $i from 1 through 3 {
      .item-#{$i} { width: 2em * $i; }
    }

    //css style
    //-------------------------------
    .item-1 {
      width: 2em;
    }
    .item-2 {
      width: 4em;
    }
    .item-3 {
      width: 6em;
    }

    @each

    $headings: (h1: 2em, h2: 1.5em, h3: 1.2em);
    @each $header, $size in $headings {
      #{$header} {
        font-size: $size;
      }
    }

