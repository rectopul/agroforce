const Responser = global.requiremix("@src/classes/metadmin/responser");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const isAuthenticated = global.requiremix("@src/policies/isAuthenticated");
const _ = require("lodash");
const moment = require("moment");

const Excel = require("exceljs/modern.nodejs");

let colunas = [
  {
    name: "NOME*",
    key: "nome",
    width: 30,
    obr: true,
  },
  {
    name: "E-MAIL RESPONSÁVEL*",
    key: "email",
    width: 30,
    obr: true,
  },
  {
    name: "MOVER LIVREMENTE (SIM/NAO)*",
    key: "mover",
    width: 40,
    obr: true,
    lista: ["SIM", "NÃO"],
  },
  // {
  //   name: "CARGO*",
  //   key: "cargo",
  //   width: 20,
  //   obr: true,
  // },
];

module.exports = [
  (app, basepath) => {
    // http://localhost:8081/action/uploader/posicoes/download
    app.get(`${basepath}/download`, async (req, res) => {
      colunas = colunas.map((c) => {
        c.name = global.T(req, c.name);
        if (c.lista) {
          c.lista = c.lista.map((l) => global.T(req, l));
        }
        return c;
      });
      var workbook = new Excel.Workbook();
      var worksheet = workbook.addWorksheet(global.T(req, "Rotina"));

      let rows = [];
      let row = [];
      rows.push(row);

      // add a table to a sheet
      worksheet.addTable({
        name: "MyTable",
        ref: "A1",
        headerRow: true,
        totalsRow: false,
        style: {
          showRowStripes: true,
        },
        columns: colunas,
        rows: rows,
      });
      global.fn.formataColunasExcel(worksheet, colunas);
      // let filename_now = new Date().getTime() + ".xlsx";
      let filename_now = global.T(req, "Rotina") + ".xlsx";
      let filename =
        global.config.storage.arquivosfolder + "/tmp/" + filename_now;

      await workbook.xlsx.writeFile(filename);

      let client = new Responser(req);
      client.set("filename", filename_now);

      res.send(client.output());
    });
  },

  (app, basepath) => {
    app.post(`${basepath}/upload`, isAuthenticated, async (req, res) => {
      res.setTimeout(60 * 60 * 1000);
      global.fn.meta_did_action(req, "upload", null, {
        module: "uploader",
        display: "rotina",
      });

      colunas = colunas.map((c) => {
        c.name = global.T(req, c.name);
        if (c.lista) {
          c.lista = c.lista.map((l) => global.T(req, l));
        }
        return c;
      });
      let client = new Responser(req);
      try {
        var obj = {
          linhas: [],
          erros: [],
          rows: [],
        };

        try {
          let rows = await readXlsxFile(
            fs.createReadStream(
              global.config.storage.arquivosfolder + "/" + req.body.file
            )
          );

          obj.rows = rows;

          let alright = true;
          for (let x in rows[0]) {
            if (rows[0][x] != colunas[x].name) alright = false;
          }
          if (!alright) {
            throw {
              error: 1,
              error_msg: global.T(req, "Arquivo em formato inválido!"),
            };
          }

          for (let x in rows) {
            if (x == 0) continue;
            let linha = rows[x];
            let nome = linha[0];
            let email = linha[1];
            let mover = linha[2];
            // let cargo = linha[3];

            if (nome == null) {
              obj.erros.push(
                "" + global.T(req, "Nome é obrigatório:") + " (" + nome + ") "
              );
              continue;
            }
            if (email == null) {
              obj.erros.push(
                "" +
                  global.T(req, "E-mail Pessoa é obrigatório:") +
                  " (" +
                  email +
                  ") "
              );
              continue;
            }
            if (mover == null) {
              obj.erros.push(
                "" +
                  global.T(req, "Mover livremente é obrigatório:") +
                  " (" +
                  mover +
                  ") "
              );
              continue;
            }

            switch (mover) {
              case "sim":
                break;
              case "Sim":
                break;
              case "SIM":
                break;
              case "nao":
                break;
              case "não":
                break;
              case "Nao":
                break;
              case "Não":
                break;
              case "NAO":
                break;
              case "NÃO":
                break;
              default:
                obj.erros.push(
                  "" +
                    global.T(req, "Mover livremente apenas SIM ou NAO:") +
                    " (" +
                    mover +
                    ") "
                );
                break;
            }

            let array_perfil = email.split(",").map((k) => k.trim());
            let trava = false;

            for (let k of array_perfil) {
              let pessoa = await new global.DBC("pessoa")._login(k).loadAll();
              if (pessoa.size() == 0) {
                obj.erros.push(
                  "" +
                    global.T(req, "E-mail Pessoa não existe:") +
                    " (" +
                    k +
                    ") "
                );
                trava = true;
              }
            }
            if (trava == true) {
              continue;
            }

            obj.erros.push(null);
          }

          if (obj.erros.filter((v) => v != null).length == 0) {
            for (let x in rows) {
              if (x == 0) continue;
              let linha = rows[x];
              let nome = linha[0];
              let email = linha[1];
              let mover = linha[2];
              let numMover = 0;

              switch (mover) {
                case "sim":
                  numMover = 1;
                  break;
                case "Sim":
                  numMover = 1;
                  break;
                case "SIM":
                  numMover = 1;
                  break;
                case "nao":
                  numMover = 0;
                  break;
                case "não":
                  numMover = 0;

                  break;
                case "Nao":
                  numMover = 0;

                  break;
                case "Não":
                  numMover = 0;

                  break;
                case "NAO":
                  numMover = 0;

                  break;
                case "NÃO":
                  numMover = 0;

                  break;
              }

              // let pes = await new global.DBC("pessoa")._login(nome).loadAll();
              // let car = await new global.DBC("posicao")._nome(cargo).loadAll();

              let pf = await new DBC("rotina")._nome(nome).loadAll();
              pf._nome(nome);
              pf._livremov(numMover);
              if (pf.size()) {
                pf._last_edit_by(req.user.id);
                await pf.update();
              } else {
                pf._created_by(req.user.id);
                await pf.save();
              }

              let array_responsaveis = email.split(",").map((k) => k.trim());

              for (let k of array_responsaveis) {
                try {
                  let pessoa = await new global.DBC("pessoa")
                    ._login(k)
                    .loadAll();
                  let estrategia_responsavel = new global.DBC(
                    "rotina_rot_pessoa"
                  );
                  estrategia_responsavel._rot_pessoa(pessoa._id());
                  estrategia_responsavel._rotina(pf.id);
                  await estrategia_responsavel.save();
                } catch (err) {}
              }

              obj.linhas.push(
                "" + global.T(req, "Processado:") + " (" + nome + ") "
              );
            }
          } else {
            console.log("Error");
            obj.erros.filter((v) => console.log(v));
          }
        } catch (e) {
          console.error(e);
          throw {
            error: 1,
            error_msg: e.error_msg
              ? e.error_msg
              : global.T(req, "Arquivo não reconhecido!"),
          };
        }
        client.set("resultado", obj);
        res.send(client.output());
      } catch (error) {
        console.error(error);
        client.set("err", 1);
        client.set("errMsg", error.error_msg);
        res.send(client.output());
      }
    });
  },
];
