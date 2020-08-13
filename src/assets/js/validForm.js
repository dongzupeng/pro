
import {Toast} from 'vant';
class ValidForm{
    constructor(){
        this.validUserFormReg={

            //昵称：1-10个字符 汉字字母数字组合
            nickName:{
                reg:/^[\u4e00-\u9fa5\w]{1,10}$/,
                msg:'昵称格式不正确'
            },

            phone:{
                reg: /^1[3-9]\d{9}$/,
                msg:'手机号格式不正确'
            },
            password:{
                reg: /^[a-zA-Z]\w{5,15}$/,
                msg:'密码号格式不正确'
            },
            oldPassword:{
                reg: /^[a-zA-Z]\w{5,15}$/,
                msg:'密码号格式不正确'
            },

            email:{
                reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                msg:'邮箱格式不正确'
            },
            code:{
                reg: /^\d{6}$/,
                msg:'格式正确'
            },
            
        }
    }


    //表单验证
    validUserForm(o) {
        //o:验证表单数据  ，类型：object

        for(let key in o) {
            if(!this.validUserFormReg[key].reg.test(o[key])){
                Toast(this.validUserFormReg[key].msg);
                return false;
            }
        }
        //表单验证通过
        return true;
    }
}
export default new ValidForm();